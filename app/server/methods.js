/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

function createOrExistingUserId(email) {
  const existingUser = Accounts.findUserByEmail(email);
  if (existingUser) {
    log.info(`Using existingUser: ${existingUser._id}`);
    return existingUser._id;
  }

  const newUser = Accounts.createUser({ email });
  log.info(`Created new user: ${newUser._id}`);
  // TODO: Accounts.sendEnrollmentMail() so user can login
  return newUser._id;
}

Meteor.methods({
  insertPoolTeam(doc) {
    let newDoc = doc;
    log.info(`newDoc: `, newDoc);

    newDoc.userId = createOrExistingUserId(newDoc.userEmail);
    delete newDoc.userEmail;

    PoolTeams.schema.clean(newDoc, {
      extendAutoValueContext: {
        isInsert: true,
        isUpdate: false,
        isUpsert: false,
        isFromTrustedCode: false,
      },
    });

    log.info(`newDoc: `, newDoc);

    check(newDoc, PoolTeams.schema);
    PoolTeams.insert(newDoc);
  },
});

