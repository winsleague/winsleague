// This file will be auto-imported in the app-test context, ensuring the method is always available

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { FlowRouter } from 'meteor/kadira:flow-router';
import log from '../utils/log';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { denodeify } from '../utils/denodeify';
import { check, Match } from 'meteor/check';

import { Leagues } from '../api/leagues/leagues';
import LeagueFinder from '../api/leagues/finder';
import SeasonFinder from '../api/seasons/finder';
import { LeagueTeams } from '../api/league_teams/league_teams';

Meteor.methods({
  generateFixtures(arg) {
    check(arg, Match.Any);

    // runs on server so it's a lot easier to create fixtures here

    log.info('Resetting database');
    resetDatabase({ excludedCollections: [
      'leagues', 'seasons', 'league_teams', 'season_league_teams', 'league_pick_expected_wins',
      '__kdtimeevents', '__kdtraces',
    ] });

    log.info('Loading default fixtures');

    // It'd be great if we could just have a single Factory.create('poolTeam') and have the
    // factories create all the scaffolding. Unfortunately it creates a bunch of duplicate
    // records so I decided to use this little workaround.
    const leagueId = LeagueFinder.getIdByName('NFL');
    const leagueTeamId = LeagueTeams.findOne({ leagueId })._id;
    const seasonId = SeasonFinder.getLatestByLeagueId(leagueId)._id;
    const userId = Accounts.createUser({ email: 'test@test.com', password: 'test' });
    const poolId = Factory.create('pool', { leagueId, latestSeasonId: seasonId, commissionerUserId: userId })._id;
    const poolTeamId = Factory.create('poolTeam', { seasonId, poolId, userId })._id;
    Factory.create('poolTeamPick', { poolTeamId, poolId, leagueTeamId, seasonId });

    Factory.create('seasonLeagueTeam', {
      leagueId,
      seasonId,
      leagueTeamId,
      wins: 10,
      losses: 6,
      ties: 0,
      homeWins: 6,
      homeLosses: 3,
      homeTies: 0,
      awayWins: 4,
      awayLosses: 3,
      awayTies: 0,
      pointsFor: 17,
      pointsAgainst: 14,
    });

    log.info('Done loading fixtures');
  },
});

let generateData;
if (Meteor.isClient) {
  // Create a second connection to the server to use to call test data methods
  // We do this so there's no contention w/ the currently tested user's connection
  const testConnection = Meteor.connect(Meteor.absoluteUrl());

  generateData = denodeify((cb) => {
    testConnection.call('generateFixtures', cb);
  });
}

export { generateData };
