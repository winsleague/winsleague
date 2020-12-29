import { Migrations } from 'meteor/percolate:migrations';
import SeasonCreator from '../../imports/api/seasons/server/creator';

const year = 2020;
const leagueName = 'NBA';

Migrations.add({
  version: 23,
  name: `Adds ${year} season to ${leagueName}`,
  up: () => {
    SeasonCreator.create(
      leagueName,
      year,
      new Date(year, 11, 22), // months are zero-based
      new Date(year + 1, 4, 16), // months are zero-based
    );
  },
  down: () => {
    SeasonCreator.remove(leagueName, year);
  },
});
