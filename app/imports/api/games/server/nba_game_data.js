import log from '../../../utils/log';

import LeagueFinder from '../../leagues/finder';
import LeagueTeamFinder from '../../league_teams/finder';
import SeasonFinder from '../../seasons/finder';

import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';

export default {
  ingestSeasonData(season) {
    const league = LeagueFinder.getByName('NBA');
    if (! league) throw new Error(`League is not found!`);

    if (! season) season = SeasonFinder.getLatestByLeague(league);

    const url = 'https://erikberg.com/nba/standings.json';

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url, {
      headers: { 'user-agent': 'Meteor/1.2 (https://github.com/winsleague/winsleague)' },
    });
    // clean the JSON because the keys don't have quotes
    const cleanJSON = response.content.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?: /g, '"$2": ');
    log.debug(`cleanJSON: ${cleanJSON}`);
    const parsedJSON = JSON.parse(cleanJSON);

    log.debug('parsedJSON.standing: ', parsedJSON.standing);
    parsedJSON.standing.forEach(teamData => {
      log.debug('teamData: ', teamData);
      this.saveTeam(league, season, teamData);
    });
  },

  saveTeam(league, season, teamData) {
    const leagueTeam = LeagueTeamFinder.getByName(league, teamData.first_name, teamData.last_name);
    if (!leagueTeam) {
      throw new Error('Unable to find team!', teamData);
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
          wins: teamData.won, losses: teamData.lost, ties: 0,
          homeWins: teamData.home_won, homeLosses: teamData.home_lost, homeTies: 0,
          awayWins: teamData.away_won, awayLosses: teamData.away_lost, awayTies: 0,
          pointsFor: teamData.points_for, pointsAgainst: teamData.points_against,
        }
      });
  },
};
