/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';

import Utils from './utils';
import { Leagues } from '../../../api/leagues/leagues';
import { LeagueTeams } from '../../../api/league_teams/league_teams';

describe('Utils', function () {
  describe('initializeLeagues', function () {
    beforeEach(() => {
      Utils.initializeLeagues();
    });

    it('should seed the Leagues', function () {
      assert.isAbove(Leagues.find().count(), 0);
    });

    it('should seed the League Teams', function () {
      assert.isAbove(LeagueTeams.find().count(), 0);
    });
  });
});
