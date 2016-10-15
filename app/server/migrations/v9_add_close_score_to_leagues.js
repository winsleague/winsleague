import { Migrations } from 'meteor/percolate:migrations';
import { Leagues } from '../../imports/api/leagues/leagues';
import LeagueFinder from '../../imports/api/leagues/finder';
import { SeasonLeagueTeams } from '../../imports/api/season_league_teams/season_league_teams';
import { PoolTeamPicks } from '../../imports/api/pool_team_picks/pool_team_picks';
import { PoolTeams } from '../../imports/api/pool_teams/pool_teams';
import SeasonLeagueTeamUpdater from '../../imports/api/season_league_teams/server/updater';

Migrations.add({
  version: 9,
  name: 'Adds the close score field to each league',
  up: () => {
    const nflLeague = LeagueFinder.getByName('NFL');
    if (!nflLeague) {
      throw new Error('NFL league not found!');
    }
    Leagues.update(nflLeague._id,
      {
        $set: {
          closeScore: 3,
        },
      }
    );

    const nbaLeague = LeagueFinder.getByName('NBA');
    if (!nbaLeague) {
      throw new Error('NBA league not found!');
    }
    Leagues.update(nbaLeague._id,
      {
        $set: {
          closeScore: 3,
        },
      }
    );

    const mlbLeague = LeagueFinder.getByName('MLB');
    if (!mlbLeague) {
      throw new Error('MLB league not found!');
    }
    Leagues.update(mlbLeague._id,
      {
        $set: {
          closeScore: 1,
        },
      }
    );


    // Initialize to zero to avoid undefined errors
    SeasonLeagueTeams.find().forEach((seasonLeagueTeam) => {
      SeasonLeagueTeams.direct.update(seasonLeagueTeam._id, {
        $set: {
          closeWins: 0,
          closeLosses: 0,
        },
      });
    });

    // Update closeWins and closeLosses everywhere
    SeasonLeagueTeams.find().forEach((seasonLeagueTeam) => {
      SeasonLeagueTeamUpdater.updateTeamStats(seasonLeagueTeam.leagueId,
        seasonLeagueTeam.seasonId, seasonLeagueTeam.leagueTeamId);
    });
  },

  down: () => {
    Leagues.update({}, {
      $unset: {
        closeScore: '',
      },
    }, {
      multi: true,
      validate: false,
    });

    SeasonLeagueTeams.direct.update({}, {
      $unset: {
        closeWins: '',
        closeLosses: '',
      },
    }, {
      multi: true,
      validate: false,
    });

    PoolTeamPicks.direct.update({}, {
      $unset: {
        closeWins: '',
        closeLosses: '',
      },
    }, {
      multi: true,
      validate: false,
    });

    PoolTeams.direct.update({}, {
      $unset: {
        closeWins: '',
        closeLosses: '',
      },
    }, {
      multi: true,
      validate: false,
    });
  },
});
