import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import log from '../../utils/log';

import { Seasons } from './seasons';

import '../leagues/leagues_factory';

Factory.define('season', Seasons, {
  leagueId: Factory.get('league'),
  year: () => _.random(2000, 2014),
  startDate: new Date(),
  endDate: new Date(),
  status: 'in progress',
}).after(factory => {
  log.debug('season factory created:', factory);
});

