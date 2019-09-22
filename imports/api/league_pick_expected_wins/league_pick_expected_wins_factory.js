import { Factory } from 'meteor/dburles:factory';
import log from '../../utils/log';

import { LeaguePickExpectedWins } from './league_pick_expected_wins';
import '../leagues/leagues_factory';

Factory.define('leaguePickExpectedWin', LeaguePickExpectedWins, {
  leagueId: Factory.get('league'),
}).after((factory) => {
  log.debug('leaguePickExpectedWin factory created:', factory);
});
