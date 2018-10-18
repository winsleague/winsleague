import { Migrations } from 'meteor/percolate:migrations';
import SeasonCreator from '../../imports/api/seasons/server/creator';

const year = 2018;
const leagueName = 'NBA';

Migrations.add({
  version: 17,
  name: `Adds 2018 season to ${leagueName}`,
  up: () => {
    SeasonCreator.create(
      leagueName,
      year,
      new Date(year, 9, 16), // months are zero-based
      new Date(year + 1, 3, 20), // months are zero-based
    );
  },
  down: () => {
    SeasonCreator.remove(leagueName, year);
  },
});
