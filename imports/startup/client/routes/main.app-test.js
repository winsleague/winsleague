/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { assert } from 'chai';
import { $ } from 'meteor/jquery';
import log from '../../../utils/log';

import { waitForSubscriptions, afterFlushPromise, resetRoute, login } from './helpers.app-tests';
import { generateData } from './../../../api/generate-data.app-tests';


if (Meteor.isClient) {
  describe('Full-app test of Homepage', function () {
    this.timeout(10000);

    beforeEach(() =>
      resetRoute()
        .then(() => generateData())
        .then(login)
        .then(waitForSubscriptions)
    );

    afterEach((done) => {
      Meteor.logout(() => {
        log.info('Logged out');
        FlowRouter.go('/?force=true');
        FlowRouter.watchPathChange();
        done();
      });
    });

    it('has title on homepage', () => {
      return afterFlushPromise()
        .then(() => {
          assert.equal($('a.navbar-brand').html(), 'Wins League');
        });
    });
  });
}
