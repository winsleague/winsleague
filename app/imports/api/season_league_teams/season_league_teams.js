import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import log from '../../utils/log';

import '../leagues/leagues'; // needed for factory
import { Seasons } from '../seasons/seasons'; // needed for factory
import { LeagueTeams } from '../league_teams/league_teams'; // needed for factory

export const SeasonLeagueTeams = new Mongo.Collection('season_league_teams');

SeasonLeagueTeams.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  leagueTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  abbreviation: {
    type: String,
  },
  wins: {
    type: Number,
    defaultValue: 0,
  },
  losses: {
    type: Number,
    defaultValue: 0,
  },
  ties: {
    type: Number,
    defaultValue: 0,
  },
  homeWins: {
    type: Number,
    defaultValue: 0,
  },
  homeLosses: {
    type: Number,
    defaultValue: 0,
  },
  homeTies: {
    type: Number,
    defaultValue: 0,
  },
  awayWins: {
    type: Number,
    defaultValue: 0,
  },
  awayLosses: {
    type: Number,
    defaultValue: 0,
  },
  awayTies: {
    type: Number,
    defaultValue: 0,
  },
  pointsFor: {
    type: Number,
    defaultValue: 0,
  },
  pointsAgainst: {
    type: Number,
    defaultValue: 0,
  },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
});

SeasonLeagueTeams.attachSchema(SeasonLeagueTeams.schema);

SeasonLeagueTeams.helpers({
  totalGames() {
    return this.wins + this.losses + this.ties;
  },

  record() {
    if (this.ties > 0) {
      return `${this.wins}-${this.losses}-${this.ties}`;
    }
    return `${this.wins}-${this.losses}`;
  }
});

SeasonLeagueTeams.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


Factory.define('seasonLeagueTeam', SeasonLeagueTeams, {
  leagueId: Factory.get('league'),
  seasonId: Factory.get('season'),
  leagueTeamId: Factory.get('leagueTeam'),
}).after(factory => {
  const season = Seasons.findOne(factory.seasonId);
  season.leagueId = factory.leagueId;
  Seasons.update(season._id,
    {
      $set: {
        leagueId: factory.leagueId,
      },
    });

  const leagueTeam = LeagueTeams.findOne(factory.leagueTeamId);
  leagueTeam.leagueId = factory.leagueId;
  LeagueTeams.update(leagueTeam._id,
    {
      $set: {
        leagueId: factory.leagueId,
      },
    });

  log.debug('seasonLeagueTeam factory created:', factory);
});
