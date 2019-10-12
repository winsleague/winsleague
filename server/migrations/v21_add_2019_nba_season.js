import { Migrations } from 'meteor/percolate:migrations';
import SeasonCreator from '../../imports/api/seasons/server/creator';

const year = 2019;
const leagueName = 'NBA';

Migrations.add({
  version: 21,
  name: `Adds ${year} season to ${leagueName}`,
  up: () => {
    SeasonCreator.create(
      leagueName,
      year,
      new Date(year, 9, 21), // months are zero-based
      new Date(year + 1, 3, 16), // months are zero-based
    );
  },
  down: () => {
    SeasonCreator.remove(leagueName, year);
  },
});
