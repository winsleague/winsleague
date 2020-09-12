import { Migrations } from 'meteor/percolate:migrations';
import LeagueFinder from '../../imports/api/leagues/finder';
import SeasonCreator from '../../imports/api/seasons/server/creator';
import SeasonFinder from '../../imports/api/seasons/finder';
import NflGameData from '../../imports/api/games/server/nfl_game_data';
import { Games } from '../../imports/api/games/games';
import { LeagueTeams } from '../../imports/api/league_teams/league_teams';

const year = 2020;

Migrations.add({
  version: 22,
  name: 'Adds 2020 season to NFL',
  up: () => {
    const league = LeagueFinder.getByName('NFL');
    const leagueId = league._id;
    let season = SeasonFinder.getByYear('NFL', year);

    if (season) {
      Games.remove({ leagueId: league._id, seasonId: season._id });
    }

    SeasonCreator.remove('NFL', year);

    const washLeagueTeam = LeagueTeams.findOne({
      leagueId,
      cityName: 'Washington',
    });
    LeagueTeams.direct.update(washLeagueTeam._id,
      {
        $set: {
          mascotName: 'Football Team',
        },
      });

    const raidersLeagueTeam = LeagueTeams.findOne({
      leagueId,
      mascotName: 'Raiders',
    });
    LeagueTeams.direct.update(raidersLeagueTeam._id,
      {
        $set: {
          abbreviation: 'LV',
          cityName: 'Las Vegas',
        },
      });

    const chargersLeagueTeam = LeagueTeams.findOne({
      leagueId,
      mascotName: 'Chargers',
    });
    LeagueTeams.direct.update(chargersLeagueTeam._id,
      {
        $set: {
          abbreviation: 'LAC',
          cityName: 'Los Angeles',
        },
      });

    SeasonCreator.create(
      'NFL',
      year,
      new Date(year, 8, 9), // months are zero-based
      new Date(year + 1, 0, 5), // months are zero-based
    );

    season = SeasonFinder.getByYear('NFL', year);
    NflGameData.ingestSeasonData(season);
  },
  down: () => {
    const league = LeagueFinder.getByName('NFL');
    const season = SeasonFinder.getByYear('NFL', year);

    Games.remove({ leagueId: league._id, seasonId: season._id });

    SeasonCreator.remove('NFL', year);
  },
});
