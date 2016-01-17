/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

let prettyjson = Meteor.npmRequire( 'prettyjson' );

Meteor.methods({
  insertPoolTeam: function (doc) {
    log.info(`doc: ${prettyjson.render(doc)}`);

    doc.userId = createOrExistingUserId(doc.userEmail);
    delete doc.userEmail;

    PoolTeams.schema.clean(doc, {
      extendAutoValueContext: {
        isInsert: true,
        isUpdate: false,
        isUpsert: false,
        isFromTrustedCode: false
      }
    });

    log.info(`doc: ${prettyjson.render(doc)}`);

    check(doc, PoolTeams.schema);
    PoolTeams.insert(doc);
  }
});

var createOrExistingUserId = (email) => {
  const existingUser = Accounts.findUserByEmail(email);
  if (existingUser) {
    log.info(`Using existingUser: ${existingUser._id}`);
    return existingUser._id;
  } else {
    const newUser = Accounts.createUser({email: email});
    log.info(`Created new user: ${newUser._id}`);
    // TODO: Accounts.sendEnrollmentMail() so user can login
    return newUser._id;
  }
};
