Mailer.config({
  from: 'League Wins Pool <team@leaguewinspool.com>',
  replyTo: 'League Wins Pool <team@leaguewinspool.com>',
  routePrefix: 'emails',              // Route prefix.
  baseUrl: process.env.ROOT_URL,      // The base domain to build absolute link URLs from in the emails.
  testEmail: 'team@leaguewinspool.com',  // Default address to send test emails to.
  logger: log,
  addRoutes: process.env.NODE_ENV === 'development',
  plainTextOpts: {
    ignoreImage: true,
  },
});

Meteor.startup(() => {
  Mailer.init({
    templates: Templates,     // Global Templates namespace, see lib/templates.js.
    helpers: TemplateHelpers, // Global template helper namespace.
    layout: {
      name: 'emailLayout',
      path: 'layout.html',   // Relative to 'private' dir.
      scss: 'layout.scss',
    },
  });
});
