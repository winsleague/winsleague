/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';

import PoolTeamUpdater from '../../pool_teams/server/updater';
import './hooks';

import { expect } from 'meteor/practicalmeteor:chai';
import { spies } from 'meteor/practicalmeteor:sinon';

describe('Season League Teams Hooks', function () {
  describe('When Season League Teams are inserted or updated', function () {
    it('should update Pool Teams who picked the League Team', function () {
      spies.create('updateWhoPickedLeagueTeam', PoolTeamUpdater, 'updateWhoPickedLeagueTeam');

      const seasonLeagueTeam = Factory.create('seasonLeagueTeam');

      expect(spies.updateWhoPickedLeagueTeam).to.have.been.calledWith(seasonLeagueTeam.leagueTeamId);

      spies.restoreAll();
    });
  });
});
