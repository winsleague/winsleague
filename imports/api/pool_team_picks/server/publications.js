/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { PoolTeamPicks } from '../pool_team_picks';

Meteor.publish('poolTeamPicks.single', function poolTeamPicksSingle(poolTeamPickId) {
  check(poolTeamPickId, Match.Maybe(String));
  if (!poolTeamPickId) {
    return this.ready();
  }

  return PoolTeamPicks.find(poolTeamPickId);
});

Meteor.publish('poolTeamPicks.ofPoolTeam', function poolTeamPicksOfPoolTeam(poolTeamId) {
  check(poolTeamId, Match.Maybe(String));
  if (!poolTeamId) {
    return this.ready();
  }

  return PoolTeamPicks.find({ poolTeamId });
});

Meteor.publish('poolTeamPicks.ofPool', function poolTeamPicksOfPool(poolId, seasonId = null) {
  check(poolId, Match.Maybe(String));
  if (!poolId) {
    return this.ready();
  }

  if (seasonId) {
    check(seasonId, String);
    return PoolTeamPicks.find({ poolId, seasonId });
  }

  return PoolTeamPicks.find({ poolId });
});
