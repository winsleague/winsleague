/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

import { PoolTeams } from '../../pool_teams/pool_teams';
import { Seasons } from '../seasons';
import SeasonFinder from '../finder';

Meteor.publish('seasons.single', function(_id) {
  check(_id, Match.Maybe(String));
  if (! _id) return this.ready();
  return Seasons.find(_id);
});

Meteor.publish('seasons.latest', function() {
  // very simple implementation that just returns all the seasons
  // instead of the latest one for each league
  return Seasons.find();
});

Meteor.publish('seasons.latest.ofLeague', function(leagueId) {
  check(leagueId, Match.Maybe(String));
  if (! leagueId) return this.ready();
  return SeasonFinder.getLatestCursorByLeagueId(leagueId);
});

Meteor.publish('seasons.ofPool', function(poolId) {
  check(poolId, String);

  ReactiveAggregate(this, PoolTeams, [
    {
      $match: {
        poolId: poolId,
      },
    },
    {
      $group: {
        _id: '$seasonId',
        year: { $first: '$seasonYear' },
      },
    },
  ],
    {
      observeSelector: { poolId }, // only observe PoolTeams for this pool (perf reasons)
      clientCollection: 'seasons',
    }
  );
});

