// This file will be auto-imported in the app-test context, ensuring the method is always available

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import log from '../startup/log';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Promise } from 'meteor/promise';

Meteor.methods({
  generateFixtures() {
    resetDatabase();

    log.info('Loading default fixtures');

    Factory.create('poolTeam');

    Accounts.createUser({ email: 'test@test.com' });
  },
});

let generateData;
if (Meteor.isClient) {
  // Create a second connection to the server to use to call test data methods
  // We do this so there's no contention w/ the currently tested user's connection
  const testConnection = Meteor.connect(Meteor.absoluteUrl());

  generateData = Promise.denodeify((cb) => {
    testConnection.call('generateFixtures', cb);
  });
}

export { generateData };
