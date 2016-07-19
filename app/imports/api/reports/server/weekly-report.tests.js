/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import log from '../../../startup/log';

import WeeklyReport from './weekly-report';

import '../../pool_teams/pool_teams'; // needed for factory

import { assert } from 'meteor/practicalmeteor:chai';

describe('Weekly Report', () => {
  it('puts together player emails', () => {
    const firstEmail = faker.internet.email();
    const firstUser = Accounts.createUser({ email: firstEmail });
    const firstUserId = Accounts.findUserByEmail(firstEmail)._id;

    const poolTeam = Factory.create('poolTeam', {
      userTeamName: 'first user',
      userId: firstUserId,
    });
    const seasonId = poolTeam.seasonId;
    const poolId = poolTeam.poolId;

    const secondEmail = faker.internet.email();
    const secondUser = Accounts.createUser({ email: secondEmail });
    const secondUserId = Accounts.findUserByEmail(secondEmail)._id;

    Factory.create('poolTeam', {
      seasonId,
      poolId,
      userTeamName: 'second user',
      userId: secondUserId,
    });

    const playerEmails = WeeklyReport.getPlayerEmails(poolId, seasonId);

    assert.equal(playerEmails, `first user <${firstEmail}>, second user <${secondEmail}>`);
  });
});
