/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { PoolTeamPicks } from '../pool_team_picks';

Meteor.publish('poolTeamPicks.single', function poolTeamPicksSingle(poolTeamPickId) {
  if (!poolTeamPickId) return this.ready();
  check(poolTeamPickId, String);

  return PoolTeamPicks.find(poolTeamPickId);
});

Meteor.publish('poolTeamPicks.ofPoolTeam', function poolTeamPicksOfPoolTeam(poolTeamId) {
  if (!poolTeamId) return this.ready();
  check(poolTeamId, String);

  return PoolTeamPicks.find({ poolTeamId });
});

Meteor.publish('poolTeamPicks.ofPool', function poolTeamPicksOfPool(poolId, seasonId = null) {
  if (!poolId) return this.ready();
  check(poolId, String);

  if (seasonId) {
    check(seasonId, String);
    return PoolTeamPicks.find({ poolId, seasonId });
  } else {
    return PoolTeamPicks.find({ poolId });
  }
});
