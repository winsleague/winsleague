import { xml2js } from 'meteor/peerlibrary:xml2js';
import moment from 'moment-timezone';
import log from '../../../utils/log';

import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';

import { LeagueTeams } from '../../league_teams/league_teams';
import { Games } from '../games';

function friendlyQuarter(old) {
  if (old === 'P') { return 'pregame'; }
  if (old === 'O') { return 'overtime'; }
  if (old === 'F') { return 'final'; }
  if (old === 'FO') { return 'final overtime'; }
  return old;
}

function cleanStatus(old) {
  if (old === 'P' || old === 'Pregame') { return 'scheduled'; }
  if (old === 'F' || old === 'Final' || old === 'FO' || old === 'final overtime') { return 'completed'; }
  return 'in progress';
}

export default {
  updateLiveScores(force) {
    const league = LeagueFinder.getByName('NFL');

    const today = moment();

    // only run during season
    const season = SeasonFinder.getLatestByLeague(league);
    if (!season) {
      throw new Error(`Season is not found for league ${league._id}!`);
    }
    const seasonId = season._id;

    if (today.isBefore(season.startDate) && !force) {
      log.info(`Not refreshing NFL standings because ${today.toDate()} is before ${season.startDate}`);
      return;
    }
    if (today.isAfter(season.endDate) && !force) {
      log.info(`Not refreshing NFL standings because ${today.toDate()} is after ${season.endDate}`);
      return;
    }

    const url = 'http://static.nfl.com/liveupdate/scorestrip/scorestrip.json';
    const response = HTTP.get(url);
    log.debug(`raw content: ${response.content}`);
    let content = response.content.replace(/,,/g, ',"",');
    content = content.replace(/,,/g, ',"",'); // do it again to address multiple commas in a row
    log.debug(`fixed content: ${content}`);

    let json;
    try {
      json = JSON.parse(content);
      log.debug('parsed json:', json);
    } catch (e) {
      log.error(content, e);
      return;
    }

    json.ss.forEach((gameData) => {
      // ["Sun","13:00:00","Final",,"NYJ","17","BUF","22",,,"56744",,"REG17","2015"]
      const gameId = gameData[10];
      const status = cleanStatus(gameData[2]);
      const quarter = gameData[2].toLowerCase();
      const timeRemaining = gameData[3].length ? moment(gameData[3], 'mm:ss').format('m:ss') : ''; // '09:32'
      const homeScore = gameData[7];
      const awayScore = gameData[5];

      const affected = Games.update(
        {
          leagueId: league._id,
          seasonId,
          gameId,
        }, {
          $set: {
            quarter,
            status,
            timeRemaining,
            homeScore,
            awayScore,
          },
        },
      );

      log.info(`Updated game with leagueId ${league._id} and gameId ${gameId}: \
(status: ${status}, quarter: ${quarter}, homeScore: ${homeScore}, awayScore: ${awayScore}, affected: ${affected})`);
    });
  },

  ingestSeasonData(season) {
    if (!season) {
      throw new Error('Season is null!');
    }

    const league = LeagueFinder.getByName('NFL');
    if (!league) {
      throw new Error('League is not found!');
    }

    for (let week = 1; week <= 17; week += 1) {
      this.ingestWeekData(season, week);
    }
  },

  ingestWeekData(season, week) {
    const url = `http://static.nfl.com/ajax/scorestrip?season=${season.year}&seasonType=REG&week=${week}`;

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url);
    const xmlString = response.content;
    log.debug(`xml: ${xmlString}`);

    const json = xml2js.parseStringSync(xmlString, { mergeAttrs: true, explicitArray: false });
    log.debug('parsed json:', json);

    log.debug('parsed json.ss.gms.g:', json.ss.gms.g);
    json.ss.gms.g.forEach((game) => {
      this.saveGame(game, season, week);
    });
  },

  saveGame(game, season, week) {
    log.info(`season: ${season.year}, week: ${week}, game: ${game.eid}`);
    const leagueId = LeagueFinder.getIdByName('NFL');
    const gameDate = this.parseGameDate(game);

    const homeLeagueTeam = LeagueTeams.findOne({
      leagueId,
      mascotName: {
        $regex: new RegExp(game.hnn, 'i'),
      },
    });
    if (!homeLeagueTeam) {
      throw new Error(`Cannot find LeagueTeam in leagueId ${leagueId} and mascot ${game.hnn}`);
    }

    const awayLeagueTeam = LeagueTeams.findOne({
      leagueId,
      mascotName: {
        $regex: `^${game.vnn}$`,
        $options: 'i',
      },
    });
    if (!awayLeagueTeam) {
      throw new Error(`Cannot find LeagueTeam in leagueId ${leagueId} and mascot ${game.vnn}`);
    }

    const result = Games.upsert(
      {
        leagueId,
        seasonId: season._id,
        gameId: game.gsis,
      }, {
        $set: {
          gameDate,
          week,
          homeTeamId: homeLeagueTeam._id,
          homeScore: game.hs,
          awayTeamId: awayLeagueTeam._id,
          awayScore: game.vs,
          quarter: friendlyQuarter(game.q),
          status: cleanStatus(game.q),
        },
      },
    );
    log.debug(`Games.upsert for leagueId ${leagueId}, seasonId ${season._id}, gameId: ${game.gsis}: \
gameDate ${gameDate}, week ${week}, homeTeamId ${homeLeagueTeam._id}, ${result.numberAffected} affected`);
  },

  parseGameDate(game) {
    // eid: 2016091101
    // t: 1:00
    const ymd = `${game.eid.substr(0, 4)}-${game.eid.substr(4, 2)}-${game.eid.substr(6, 2)}`;
    return moment.tz(`${ymd} ${game.t} PM`, 'YYYY-MM-DD h:mm A', 'US/Eastern').toDate();
  },
};
