import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import { PoolTeams } from '../pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import './hooks';

describe('Pool Teams Hooks', function () {
  this.timeout(10000);

  it('should remove its PoolTeamPicks when PoolTeam is removed', function () {
    const poolTeamPick = Factory.create('poolTeamPick');
    const { poolTeamId } = poolTeamPick;

    let poolTeamPicksCount = PoolTeamPicks.find({ poolTeamId }).count();
    assert.equal(poolTeamPicksCount, 1);

    PoolTeams.remove(poolTeamId);

    poolTeamPicksCount = PoolTeamPicks.find({ poolTeamId }).count();
    assert.equal(poolTeamPicksCount, 0);
  });
});
