import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import log from '../../utils/log';

Factory.define('user', Meteor.users, {
  username: () => faker.lorem.word(),
  profile: {
    firstName: () => faker.name.firstName(),
    lastName: () => faker.name.lastName(),
  },
  emails() {
    return [{
      address: faker.internet.email(),
      verified: false,
    }];
  },
}).after(factory => {
  log.debug('user factory created:', factory);
});
