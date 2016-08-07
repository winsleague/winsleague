import { Migrations } from 'meteor/percolate:migrations';
import log from '../../imports/utils/log';
import SeasonCreator from '../../imports/api/seasons/server/creator';
import SeasonFinder from '../../imports/api/seasons/finder';

Migrations.add({
  version: 5,
  name: 'Adds 2016 season to NFL',
  up: () => {
    SeasonCreator.create(
      'NFL',
      2016,
      new Date(2016, 8, 8), // months are zero-based
      new Date(2017, 0, 1), // months are zero-based
    );
  },
  down: () => {
    SeasonCreator.remove('NFL', 2016);
  },
});
