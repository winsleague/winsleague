import log from '../../../utils/log';

import LeagueFinder from '../../leagues/finder';
import LeagueTeamFinder from '../../league_teams/finder';
import SeasonFinder from '../../seasons/finder';

import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';

export default {
  ingestSeasonData(season) {
    const league = LeagueFinder.getByName('NBA');
    if (!league) {
      throw new Error('League is not found!');
    }

    let actualSeason;
    if (season) {
      actualSeason = season;
    } else {
      actualSeason = SeasonFinder.getLatestByLeague(league);
    }

    const url = 'http://data.nba.net/prod/v1/current/standings_all.json';

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url, {
      headers: { 'user-agent': 'Meteor/1.8 (https://github.com/winsleague/winsleague)' },
    });
    const parsedJSON = JSON.parse(response.content);

    log.debug('parsedJSON.league.standard.teams: ', parsedJSON.league.standard.teams);
    parsedJSON.league.standard.teams.forEach((teamData) => {
      log.debug('NBA teamData: ', teamData);
      this.saveTeam(league, actualSeason, teamData);
    });
  },

  saveTeam(league, season, teamData) {
    const leagueTeam = LeagueTeamFinder.getByNbaNetTeamId(league, teamData.teamId);
    if (!leagueTeam) {
      throw new Error(`Unable to find team! nbaNetTeamId: ${teamData.teamId}`);
    }

    SeasonLeagueTeams.upsert(
      {
        leagueId: league._id,
        seasonId: season._id,
        leagueTeamId: leagueTeam._id,
        abbreviation: leagueTeam.abbreviation,
      },
      {
        $set: {
          wins: teamData.win,
          losses: teamData.loss,
          ties: 0,
          homeWins: teamData.homeWin,
          homeLosses: teamData.homeLoss,
          homeTies: 0,
          awayWins: teamData.awayWin,
          awayLosses: teamData.awayLoss,
          awayTies: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          closeWins: 0,
          closeLosses: 0,
        },
      },
    );
  },
};
