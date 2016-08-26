import { xml2js } from 'meteor/peerlibrary:xml2js';
import moment from 'moment';
import log from '../../../utils/log';

import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';

import { LeagueTeams } from '../../league_teams/league_teams';
import { Games } from '../games';

function cleanPeriod(old) {
  if (old === 'P') { return 'pregame'; }
  if (old === 'O') { return 'overtime'; }
  if (old === 'F') { return 'final'; }
  if (old === 'FO') { return 'final overtime'; }
  return old;
}

function cleanStatus(old) {
  if (old === 'P') { return 'scheduled'; }
  if (old === 'F' || old === 'FO') { return 'completed'; }
  return 'in progress';
}

export default {
  updateLiveScores() {
    const league = LeagueFinder.getByName('NFL');

    const day = moment();

    // only run during season
    const season = SeasonFinder.getLatestByLeague(league);
    if (!season) {
      throw new Error(`Season is not found for league ${league._id}!`);
    }

    if (day.isSameOrBefore(season.startDate)) {
      log.info(`Not refreshing NFL standings because ${day.toDate()} is before ${season.startDate}`);
      return;
    }
    if (day.isSameOrAfter(season.endDate)) {
      log.info(`Not refreshing NFL standings because ${day.toDate()} is after ${season.endDate}`);
      return;
    }

    const url = `http://www.nfl.com/liveupdate/scorestrip/scorestrip.json`;
    const response = HTTP.get(url);
    log.debug(`raw content: ${response.content}`);
    let content = response.content.replace(/,,/g, ',"",');
    content = content.replace(/,,/g, ',"",'); // do it again to address multiple commas in a row
    log.debug(`fixed content: ${content}`);
    const json = JSON.parse(content);
    log.debug('parsed json:', json);

    for (const gameData of json.ss) {
      // ["Sun","13:00:00","Final",,"NYJ","17","BUF","22",,,"56744",,"REG17","2015"]
      const gameId = gameData[10];
      const period = gameData[2].toLowerCase();
      const timeRemaining = gameData[3];
      const homeScore = gameData[7];
      const awayScore = gameData[5];

      const affected = Games.update(
        {
          leagueId: league._id,
          gameId,
        }, {
          $set: {
            period,
            timeRemaining,
            homeScore,
            awayScore,
          },
        },
      );

      log.info(`Updated game with leagueId: ${league._id} and gameId: ${gameId} (affected: ${affected})`);
    }
  },

  ingestSeasonData(season) {
    if (! season) {
      throw new Error('Season is null!');
    }

    const league = LeagueFinder.getByName('NFL');
    if (! league) {
      throw new Error('League is not found!');
    }

    Games.remove({ leagueId: league._id, seasonId: season._id });

    for (let week = 1; week <= 17; week++) {
      this.ingestWeekData(season, week);
    }
  },

  ingestWeekData(season, week) {
    const url = `http://www.nfl.com/ajax/scorestrip?season=${season.year}&seasonType=REG&week=${week}`;

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url);
    const xmlString = response.content;
    log.debug(`xml: ${xmlString}`);

    const json = xml2js.parseStringSync(xmlString, { mergeAttrs: true, explicitArray: false });
    log.debug('parsed json:', json);

    log.debug('parsed json.ss.gms.g:', json.ss.gms.g);
    for (const game of json.ss.gms.g) {
      this.saveGame(game, season, week);
    }
  },

  saveGame(game, season, week) {
    log.info(`season: ${season.year}, week: ${week}, game: ${game.eid}`);
    const leagueId = LeagueFinder.getIdByName('NFL');
    const gameDate = new Date(`${game.eid.substr(0, 4)}-${game.eid.substr(4, 2)}-${game.eid.substr(6, 2)}`); // 20151224

    const homeLeagueTeam = LeagueTeams.findOne({
      leagueId,
      mascotName: {
        $regex: new RegExp(game.hnn, 'i'),
      },
    });
    if (! homeLeagueTeam) {
      throw new Error(`Cannot find LeagueTeam in leagueId ${leagueId} and mascot ${game.hnn}`);
    }

    const awayLeagueTeam = LeagueTeams.findOne({
      leagueId,
      mascotName: {
        $regex: `^${game.vnn}$`,
        $options: 'i',
      },
    });
    if (! awayLeagueTeam) {
      throw new Error(`Cannot find LeagueTeam in leagueId ${leagueId} and mascot ${game.vnn}`);
    }

    Games.insert({
      leagueId,
      seasonId: season._id,
      gameId: game.gsis,
      gameDate,
      week,
      homeTeamId: homeLeagueTeam._id,
      homeScore: game.hs,
      awayTeamId: awayLeagueTeam._id,
      awayScore: game.vs,
      period: cleanPeriod(game.q),
      status: cleanStatus(game.q),
    });
  },
};
