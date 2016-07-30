/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import log from '../../../utils/log';

import WeeklyReport from './weekly-report';

import '../../pool_teams/pool_teams'; // needed for factory

import { assert } from 'meteor/practicalmeteor:chai';

describe('Weekly Report', () => {
  it('puts together player emails', () => {
    const firstUser = Factory.create('user');

    const poolTeam = Factory.create('poolTeam', {
      userTeamName: 'first user',
      userId: firstUser._id,
    });
    const seasonId = poolTeam.seasonId;
    const poolId = poolTeam.poolId;

    const secondUser = Factory.create('user');

    Factory.create('poolTeam', {
      seasonId,
      poolId,
      userTeamName: 'second user',
      userId: secondUser._id,
    });

    const playerEmails = WeeklyReport.getPlayerEmails(poolId, seasonId);

    assert.equal(playerEmails, `first user <${firstUser.emails[0].address}>, second user <${secondUser.emails[0].address}>`);
  });
});
