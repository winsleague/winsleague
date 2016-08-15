/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';

import PoolTeamUpdater from '../../pool_teams/server/updater';
import './hooks';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('Season League Teams Hooks', function () {
  describe('When Season League Teams are inserted or updated', function () {
    it('should update Pool Teams who picked the League Team', function () {
      const spy = sinon.spy(PoolTeamUpdater, 'updateWhoPickedLeagueTeam');

      const seasonLeagueTeam = Factory.create('seasonLeagueTeam');

      chai.expect(spy).to.have.been.calledWith(seasonLeagueTeam.seasonId, seasonLeagueTeam.leagueTeamId);
    });
  });
});
