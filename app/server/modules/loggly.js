Modules.server.loggly = {
  init() {
    const options = {
      'level': 'info',
      'subdomain': 'leaguewinspool',
      'inputToken': process.env.LOGGLY_TOKEN,
      'json': true,
      'tags': ['meteor'],
      'handleExceptions': true,
    };

    Winston.add(Winston_Loggly, options);
  },
};
