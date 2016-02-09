Template.onlyIfLoggedIn.helpers({
  authInProcess: () => Meteor.loggingIn(),

  canShow: () => !!Meteor.user(),
});
