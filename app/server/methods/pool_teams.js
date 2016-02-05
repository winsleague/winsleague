/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

function createOrExistingUserId(email) {
  const existingUser = Accounts.findUserByEmail(email);
  if (existingUser) {
    log.debug(`Using existingUser: ${existingUser._id}`);
    return existingUser._id;
  }

  const newUser = Accounts.createUser({ email });
  log.debug(`Created new user: ${newUser._id}`);
  // TODO: Accounts.sendEnrollmentMail() so user can login
  return newUser._id;
}

PoolTeams.methods = {};

PoolTeams.methods.insert = new ValidatedMethod({
  name: 'PoolTeams.methods.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLoggedIn',
  },
  validate: PoolTeams.formSchema.validator(),
  run(doc) {
    let newDoc = doc;
    log.debug(`newDoc: `, newDoc);

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

    log.debug(`newDoc: `, newDoc);

    check(newDoc, PoolTeams.schema);
    return PoolTeams.insert(newDoc);
  },
});
