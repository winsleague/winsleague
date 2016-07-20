/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';

import { PoolTeams } from '../../pool_teams/pool_teams';
import '../../pool_teams/server/hooks';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';

import { assert } from 'meteor/practicalmeteor:chai';

describe('Pool Teams Hooks', () => {
  const spec = it('should remove its PoolTeamPicks when PoolTeam is removed', () => {
    log.info('spec:', spec.description);

    const poolTeamPick = Factory.create('poolTeamPick');
    const poolTeamId = poolTeamPick.poolTeamId;

    let poolTeamPicksCount = PoolTeamPicks.find({ poolTeamId }).count();
    assert.equal(poolTeamPicksCount, 1);

    PoolTeams.remove(poolTeamId);

    poolTeamPicksCount = PoolTeamPicks.find({ poolTeamId }).count();
    assert.equal(poolTeamPicksCount, 0);
  });
});
