import { Migrations } from 'meteor/percolate:migrations';
import LeagueFinder from '../../imports/api/leagues/finder';
import LeagueTeamFinder from '../../imports/api/league_teams/finder';
import { LeagueTeams } from '../../imports/api/league_teams/league_teams';
import nba from '../../imports/startup/server/seeds/nba';

Migrations.add({
  version: 18,
  name: `Adds the nbaNetTeamId field to each NBA league team`,
  up: () => {
    const league = LeagueFinder.getByName('NBA');

    const teams = nba.teams();
    teams.forEach(team => {
      const leagueTeam = LeagueTeamFinder.getByName(league, team.cityName, team.mascotName);
      if (!leagueTeam) {
        throw new Error(`Unable to find LeagueTeam ${team.cityName} ${team.mascotName}`);
      }
      
      LeagueTeams.direct.update(leagueTeam._id,
        {
          $set: {
            nbaNetTeamId: team.nbaNetTeamId,
          },
        });
    });

  },
  down: () => {
    // not worth doing
  },
});
