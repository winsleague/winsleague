Modules.environment = {
  isProduction() {
    if (Meteor.isClient) {
      return Meteor.settings.public.METEOR_ENV && Meteor.setings.public.METEOR_ENV === 'production';
    } else if (Meteor.isServer) {
      return process.env.METEOR_ENV === 'production';
    }
  },
};
