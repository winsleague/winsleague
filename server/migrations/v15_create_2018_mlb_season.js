import { Migrations } from 'meteor/percolate:migrations';
import SeasonCreator from '../../imports/api/seasons/server/creator';
import SeasonFinder from '../../imports/api/seasons/finder';
import MlbGameData from '../../imports/api/games/server/mlb_game_data';

const year = 2018;
const leagueName = 'MLB';

Migrations.add({
  version: 15,
  name: `Adds ${year} season to ${leagueName}`,
  up: () => {
    SeasonCreator.create(
      leagueName,
      year,
      new Date(year, 2, 29), // months are zero-based
      new Date(year, 9, 31), // months are zero-based
    );

    const season = SeasonFinder.getByYear(leagueName, year);
    MlbGameData.ingestSeasonData(season);
  },
  down: () => {
    SeasonCreator.remove(leagueName, year);
  },
});
