Modules.environment = {
  isProduction() {
    // we do it this way so it works on the client as well.
    // the client doesn't have access to process.env
    return Meteor.settings.public.METEOR_ENV && Meteor.settings.public.METEOR_ENV === 'production';
  },
};
