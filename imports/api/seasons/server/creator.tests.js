/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import '../../leagues/leagues_factory';
import '../../pools/pools_factory';
import '../../seasons/seasons_factory';
import '../../pool_teams/pool_teams_factory';

import { PoolTeams } from '../../pool_teams/pool_teams';
import { Seasons } from '../../seasons/seasons';
import SeasonCreator from '../../seasons/server/creator';

describe('Season Creator', () => {
  it('should create season and clean up', () => {
    const league = Factory.create('league');
    const season = Factory.create('season', { leagueId: league._id });
    const pool = Factory.create('pool', { leagueId: league._id, latestSeasonId: season._id });
    Factory.create('poolTeam', { seasonId: season._id, poolId: pool._id });

    const leagueName = league.name;
    const year = 2050;
    const startDate = new Date(year, 1, 5);
    const endDate = new Date(year, 5, 20);

    const poolTeamCount = PoolTeams.find().count();
    const seasonCount = Seasons.find().count();

    SeasonCreator.create(leagueName, year, startDate, endDate);

    // TODO: this is an overly simple test
    assert.notEqual(PoolTeams.find().count(), poolTeamCount, 'poolTeamCount');
    assert.notEqual(Seasons.find().count(), seasonCount, 'seasonCount');

    SeasonCreator.remove(leagueName, year);

    assert.equal(PoolTeams.find().count(), poolTeamCount, 'poolTeamCount');
    assert.equal(Seasons.find().count(), seasonCount, 'seasonCount');
  });
});
