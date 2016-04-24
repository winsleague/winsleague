import { Winston } from 'meteor/infinitedg:winston';
import { isProduction } from './environment';

const log = Winston;
if (isProduction()) {
  log.level = 'info';
} else {
  log.level = 'debug';
}
log.info('Initialized logger');

export default log;
