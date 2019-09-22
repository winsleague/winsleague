import { Factory } from 'meteor/dburles:factory';
import log from '../../utils/log';

import { PoolTeamPicks } from './pool_team_picks';

import '../pool_teams/pool_teams_factory';
import '../league_teams/league_teams_factory';

Factory.define('poolTeamPick', PoolTeamPicks, {
  poolTeamId: Factory.get('poolTeam'),
  leagueTeamId: Factory.get('leagueTeam'),
  pickNumber() { return _.random(1, 32); },
}).after((factory) => {
  log.debug('poolTeamPick factory created:', factory);
});
