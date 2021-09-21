import { Migrations } from 'meteor/percolate:migrations';
import LeagueFinder from '../../imports/api/leagues/finder';
import SeasonCreator from '../../imports/api/seasons/server/creator';
import SeasonFinder from '../../imports/api/seasons/finder';
import NflGameData from '../../imports/api/games/server/nfl_game_data';
import { Games } from '../../imports/api/games/games';

const year = 2021;

Migrations.add({
  version: 24,
  name: 'Adds 2021 season to NFL',
  up: () => {
    const league = LeagueFinder.getByName('NFL');

    let season = SeasonFinder.getByYear('NFL', year);

    if (season) {
      Games.remove({ leagueId: league._id, seasonId: season._id });
    }

    SeasonCreator.remove('NFL', year);

    SeasonCreator.create(
      'NFL',
      year,
      new Date(year, 8, 9), // months are zero-based
      new Date(year + 1, 0, 9), // months are zero-based
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
