log = Winston;
if (Modules.environment.isProduction()) {
  log.level = 'info';
} else {
  log.level = 'debug';
}
log.info('Initialized logger');

