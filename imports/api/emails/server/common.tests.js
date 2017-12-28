/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import Common from './common';

import '../../users/users_factory';
import '../../pool_teams/pool_teams_factory';

describe('Email > Common', () => {
  it('puts together player emails', () => {
    const firstUser = Factory.create('user');

    const poolTeam = Factory.create('poolTeam', {
      userTeamName: 'first user',
      userId: firstUser._id,
    });

    const leagueId = poolTeam.leagueId;
    const seasonId = poolTeam.seasonId;
    const poolId = poolTeam.poolId;

    const secondUser = Factory.create('user');

    Factory.create('poolTeam', {
      leagueId,
      seasonId,
      poolId,
      userTeamName: 'second user',
      userId: secondUser._id,
    });

    const playerEmails = Common.getPlayerEmails(poolId, seasonId);

    assert.equal(playerEmails, 
      `first user <${firstUser.emails[0].address}>, second user <${secondUser.emails[0].address}>`);
  });
});
