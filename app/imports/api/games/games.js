import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';
import { _ } from 'lodash';

import { PoolTeams } from '../pool_teams/pool_teams';
import { SeasonLeagueTeams } from '../season_league_teams/season_league_teams';
import { PoolTeamPicks } from '../pool_team_picks/pool_team_picks';
import { PoolGameInterestRatings } from '../pool_game_interest_ratings/pool_game_interest_ratings';

export const Games = new Mongo.Collection('games');

Games.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  gameId: {
    type: String,
    // this is not a UUID
  },
  gameDate: {
    type: Date,
  },
  week: {
    type: Number,
    optional: true,
  }, // only for NFL
  homeTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  homeScore: {
    type: Number,
    optional: true,
  },
  awayTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  awayScore: {
    type: Number,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['scheduled', 'in progress', 'completed', 'postponed', 'suspended', 'cancelled'],
  },
  quarter: {
    type: String,
    allowedValues: ['pregame', '1', '2', 'halftime', '3', '4',
      'overtime', 'final', 'final overtime'],
    optional: true,
  },
  inning: {
    type: String,
    allowedValues: ['pregame', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      'final'],
    optional: true,
  },
  topInning: {
    type: String,
    allowedValues: ['Y', 'N'],
    optional: true,
  },
  timeRemaining: {
    type: String,
    optional: true,
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

Games.attachSchema(Games.schema);

function ordinalSuffixOf(i) {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
}

Games.helpers({
  title(poolId, seasonId) {
    // "Noah's #6 NYG at Charlie's #8 GB"

    return `${this.awayTeamName(poolId, seasonId)} at ${this.homeTeamName(poolId, seasonId)}`;
  },

  homeTeamOwner(poolId, seasonId) {
    const homePoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
      leagueTeamId: this.homeTeamId,
    });

    if (homePoolTeamPick) {
      const homePoolTeam = PoolTeams.findOne(homePoolTeamPick.poolTeamId);
      return `${homePoolTeam.userTeamName}'s`;
    }
    return '';
  },

  homeTeamPick(poolId, seasonId) {
    const homePoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
      leagueTeamId: this.homeTeamId,
    });
    let homePick = '';
    if (homePoolTeamPick) {
      homePick = `#${homePoolTeamPick.pickNumber} `;
    }

    const homeLeagueTeam = SeasonLeagueTeams.findOne({
      leagueTeamId: this.homeTeamId,
      seasonId,
    });
    if (homeLeagueTeam) {
      const record = ` (${homeLeagueTeam.record()})`;
      return `${homePick}${homeLeagueTeam.abbreviation}${record}`;
    }
    return homePick;
  },

  awayTeamOwner(poolId, seasonId) {
    const awayPoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
      leagueTeamId: this.awayTeamId,
    });

    if (awayPoolTeamPick) {
      const awayPoolTeam = PoolTeams.findOne(awayPoolTeamPick.poolTeamId);
      return `${awayPoolTeam.userTeamName}'s`;
    }
    return '';
  },

  awayTeamPick(poolId, seasonId) {
    const awayPoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
      leagueTeamId: this.awayTeamId,
    });
    let awayPick = '';
    if (awayPoolTeamPick) {
      awayPick = `#${awayPoolTeamPick.pickNumber} `;
    }

    const awayLeagueTeam = SeasonLeagueTeams.findOne({
      leagueTeamId: this.awayTeamId,
      seasonId,
    });
    if (awayLeagueTeam) {
      const record = ` (${awayLeagueTeam.record()})`;
      return `${awayPick}${awayLeagueTeam.abbreviation}${record}`;
    }
    return awayPick;
  },

  friendlyDate() {
    let date = '';

    const gameDate = moment(this.gameDate).tz('US/Pacific');
    const today = moment().tz('US/Pacific');
    const isGameToday = gameDate.date() === today.date() &&
      gameDate.month() === today.month() &&
      gameDate.year() === today.year();

    if (!isGameToday) {
      date = moment(this.gameDate).tz('US/Eastern').format('ddd M/D, ');
    }

    const timezoneGuess = moment.tz.guess();
    let time = '';
    if (timezoneGuess && !timezoneGuess.includes('UTC')) {
      time = moment(this.gameDate).tz(timezoneGuess).format('ha z');
    } else {
      const est = moment(this.gameDate).tz('US/Eastern').format('ha');
      const pst = moment(this.gameDate).tz('US/Pacific').format('ha');
      time = `${est} ET / ${pst} PT`;
    }
    return `${date}${time}`;
  },

  timeStatus() {
    if (this.status === 'scheduled') {
      return this.friendlyDate();
    } else if (this.status === 'in progress') {
      if (this.quarter) {
        const q = (!isNaN(this.quarter) ? 'Q' : '');
        return `${q}${_.capitalize(this.quarter)} ${this.timeRemaining}`;
      } else if (this.inning) {
        const topBottom = (this.topInning === 'Y' ? 'Top' : 'Bottom');
        return `${topBottom} ${ordinalSuffixOf(this.inning)}`;
      }
    }
    return 'Final';
  },

  showScore() {
    return this.status !== 'scheduled';
  },

  interestRatingJustification() {
    const rating = PoolGameInterestRatings.findOne({ gameId: this._id });
    if (rating) {
      return rating.justification;
    }
    return '';
  },

  isHomeWinner() {
    return (this.status === 'completed' && this.homeScore > this.awayScore);
  },

  isAwayWinner() {
    return (this.status === 'completed' && this.awayScore > this.homeScore);
  },
});

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

