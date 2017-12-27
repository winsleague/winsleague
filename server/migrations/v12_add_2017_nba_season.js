import { Migrations } from 'meteor/percolate:migrations';
import SeasonCreator from '../../imports/api/seasons/server/creator';

const year = 2017;
const leagueName = 'NBA';

Migrations.add({
  version: 12,
  name: `Adds 2017 season to ${leagueName}`,
  up: () => {
    SeasonCreator.create(
      leagueName,
      year,
      new Date(year, 9, 20), // months are zero-based
      new Date(year + 1, 3, 11), // months are zero-based
    );
  },
  down: () => {
    SeasonCreator.remove(leagueName, year);
  },
});
