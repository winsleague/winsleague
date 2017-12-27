import { Migrations } from 'meteor/percolate:migrations';
import SeasonCreator from '../../imports/api/seasons/server/creator';

Migrations.add({
  version: 10,
  name: 'Adds 2016 season to NBA',
  up: () => {
    SeasonCreator.create(
      'NBA',
      2016,
      new Date(2016, 9, 25), // months are zero-based
      new Date(2017, 3, 12), // months are zero-based
    );
  },
  down: () => {
    SeasonCreator.remove('NBA', 2016);
  },
});
