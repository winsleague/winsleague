import log from '../../../startup/log';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { PoolTeams } from '../pool_teams';

function createOrExistingUserId(email) {
  const existingUser = Accounts.findUserByEmail(email);
  if (existingUser) {
    log.debug(`Using existingUser: ${existingUser._id}`);
    return existingUser._id;
  }

  Accounts.createUser({ email });
  const newUser = Accounts.findUserByEmail(email);
  log.debug(`Created new user: ${newUser._id}`);
  // TODO: Accounts.sendEnrollmentMail() so user can login
  return newUser._id;
}

export const insert = new ValidatedMethod({
  name: 'PoolTeams.methods.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLoggedIn',
  },
  validate: PoolTeams.formSchema.validator(),
  run(doc) {
    const newDoc = doc;
    log.debug('newDoc: ', newDoc);

    newDoc.userId = createOrExistingUserId(newDoc.userEmail);
    delete newDoc.userEmail;

    // trigger AutoValues
    PoolTeams.schema.clean(newDoc, {
      extendAutoValueContext: {
        isInsert: true,
        isUpdate: false,
        isUpsert: false,
        isFromTrustedCode: false,
      },
    });

    log.debug('newDoc: ', newDoc);

    check(newDoc, PoolTeams.schema);
    return PoolTeams.insert(newDoc);
  },
});
