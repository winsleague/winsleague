import moment from 'moment-timezone';
import log from '../../../utils/log';

import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';

import { LeagueTeams } from '../../league_teams/league_teams';
import { Games } from '../games';

function cleanStatus(old) {
  if (old === 'STATUS_SCHEDULED') { return 'scheduled'; }
  if (old === 'STATUS_FINAL') { return 'completed'; }
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

    if (today.isBefore(season.startDate) && !force) {
      log.info(`Not refreshing NFL standings because ${today.toDate()} is before ${season.startDate}`);
      return;
    }
    if (today.isAfter(season.endDate) && !force) {
      log.info(`Not refreshing NFL standings because ${today.toDate()} is after ${season.endDate}`);
      return;
    }

    const url = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
    const response = HTTP.get(url);
    log.debug(`raw content: ${response.content}`);
    let json;
    try {
      json = JSON.parse(response.content);
      log.debug('parsed json:', json);
    } catch (e) {
      log.error(response.content, e);
      return;
    }
    log.debug('parsed json:', json);

    const week = json.week.number;

    log.debug('parsed json.events:', json.events);
    json.events.forEach((game) => {
      this.saveGame(game, season, week);
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

    for (let week = 1; week <= 18; week += 1) {
      this.ingestWeekData(season, week);
    }
  },

  ingestWeekData(season, week) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}`;

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url);

    let json;
    try {
      json = JSON.parse(response.content);
      log.debug('parsed json:', json);
    } catch (e) {
      log.error(response.content, e);
      return;
    }
    log.debug('parsed json:', json);

    log.debug('parsed json.events:', json.events);
    json.events.forEach((game) => {
      this.saveGame(game, season, week);
    });
  },

  saveGame(game, season, week) {
    log.info(`season: ${season.year}, week: ${week}, game: ${game.id}`);
    const leagueId = LeagueFinder.getIdByName('NFL');
    const gameDate = this.parseGameDate(game);

    if (!game.id) {
      throw new Error(`Invalid game data ${game}`);
    }
    

    const homeAbbreviation = game.competitions[0].competitors[0].team.abbreviation;
    const homeLeagueTeam = LeagueTeams.findOne({
      leagueId,
      abbreviation: homeAbbreviation,
    });
    if (!homeLeagueTeam) {
      throw new Error(`Cannot find LeagueTeam in leagueId ${leagueId} and abbrevation ${homeAbbreviation}`);
    }

    const awayAbbreviation = game.competitions[0].competitors[1].team.abbreviation;
    const awayLeagueTeam = LeagueTeams.findOne({
      leagueId,
      abbreviation: awayAbbreviation,
    });
    if (!awayLeagueTeam) {
      throw new Error(`Cannot find LeagueTeam in leagueId ${leagueId} and abbreviation ${awayAbbreviation}`);
    }

    const result = Games.upsert(
      {
        leagueId,
        seasonId: season._id,
        gameId: game.id,
      }, {
        $set: {
          gameDate,
          week,
          homeTeamId: homeLeagueTeam._id,
          homeScore: game.competitions[0].competitors[0].score,
          awayTeamId: awayLeagueTeam._id,
          awayScore: game.competitions[0].competitors[1].score,
          status: cleanStatus(game.status.type.name),
          timeRemaining: game.status.type.shortDetail,
        },
      },
    );
    log.debug(`Games.upsert for leagueId ${leagueId}, seasonId ${season._id}, gameId: ${game.gsis}: \
gameDate ${gameDate}, week ${week}, homeTeamId ${homeLeagueTeam._id}, ${result.numberAffected} affected`);
  },

  parseGameDate(game) {
    // date: 2021-09-21T00:15Z
    return moment.parseZone(game.date).toDate();
  },
};
