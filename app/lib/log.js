log = new (Winston.Logger)({
  transports: [
    new (Winston.transports.Console)({ level: 'info' }),
    // change this dynamically in `meteor shell` by running `log.transports.console.level = 'debug'`
  ],
});
log.info('Initialized logger');
