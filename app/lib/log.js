log = Winston;
if (process.env.NODE_ENV === 'production') {
  log.level = 'info';
} else {
  log.level = 'debug';
}
log.info('Initialized logger');
