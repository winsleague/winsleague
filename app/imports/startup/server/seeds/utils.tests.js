/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import Utils from './utils';
import { Leagues } from '../../../api/leagues/leagues';
import { LeagueTeams } from '../../../api/league_teams/league_teams';

import { chai } from 'meteor/practicalmeteor:chai';

describe('Utils', function () {
  describe('initializeLeagues', function () {
    beforeEach(() => {
      Utils.initializeLeagues();
    });
    
    it('should seed the Leagues', function () {
      chai.assert.isAbove(Leagues.find().count(), 0);
    });

    it('should seed the League Teams', function () {
      chai.assert.isAbove(LeagueTeams.find().count(), 0);
    });
  });
});
