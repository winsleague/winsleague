// This file will be auto-imported in the app-test context, ensuring the method is always available

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import log from '../utils/log';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { denodeify } from '../utils/denodeify';

Meteor.methods({
  generateFixtures() {
    log.info('Resetting database');
    resetDatabase({ excludedCollections: ['__kdtimeevents', '__kdtraces'] });

    log.info('Loading default fixtures');

    // It'd be great if we could just have a single Factory.create('poolTeam') and have the
    // factories create all the scaffolding. Unfortunately it creates a bunch of duplicate
    // records so I decided to use this little workaround.
    const leagueId = Factory.create('league')._id;
    const seasonId = Factory.create('season', { leagueId })._id;
    const userId = Accounts.createUser({ email: 'test@test.com', password: 'test' });
    const poolId = Factory.create('pool', { leagueId, latestSeasonId: seasonId, commissionerUserId: userId })._id;
    Factory.create('poolTeam', { seasonId, poolId, userId });
  },
});

let generateData;
if (Meteor.isClient) {
  // Create a second connection to the server to use to call test data methods
  // We do this so there's no contention w/ the currently tested user's connection
  const testConnection = Meteor.connect(Meteor.absoluteUrl());

  generateData = denodeify((cb) => {
    testConnection.call('generateFixtures', cb);
  });
}

export { generateData };
