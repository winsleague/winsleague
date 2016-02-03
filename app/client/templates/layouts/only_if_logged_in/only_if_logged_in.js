Template.onlyIfLoggedIn.helpers({
  authInProcess() {
    return Meteor.loggingIn();
  },
  canShow() {
    return !!Meteor.user();
  },
});
