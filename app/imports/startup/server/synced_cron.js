import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import moment from 'moment-timezone';
import log from '../../utils/log';

import SeasonFinder from '../../api/seasons/finder';
import NflGameData from '../../api/games/server/nfl_game_data';
import NbaGameData from '../../api/games/server/nba_game_data';
import MlbGameData from '../../api/games/server/mlb_game_data';

import RatingCalculator from '../../api/pool_game_interest_ratings/server/calculator';
import WeeklyLeaderboardEmail from '../../api/emails/server/weekly-leaderboard-email';
import WeeklyGamesToWatchEmail from '../../api/emails/server/weekly-games-to-watch';

if (!Meteor.isTest && !Meteor.isAppTest) {
  log.info('Initializing SyncedCron');

  const SyncedCronLogger = opts => {
    log.log(opts.level, `${opts.tag}: ${opts.message}`);
  };

  SyncedCron.config({
    logger: SyncedCronLogger,
    utc: true,
  });

  // parser is a later.parse object
  // we catch exceptions so we can report them to Rollbar

  SyncedCron.add({
    name: 'Refresh NFL standings',
    schedule(parser) {
      return parser.recur().every(5).minute();
    },
    job() {
      try {
        NflGameData.updateLiveScores();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'NflGameData.updateLiveScores()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Refresh NBA standings',
    schedule(parser) {
      return parser.recur().every(5).minute();
    },
    job() {
      try {

        // only run during season
        const season = SeasonFinder.getLatestByLeagueName('NBA');
        const day = moment.tz('US/Pacific');
        if (day.isBefore(season.startDate)) {
          log.info(`Not refreshing NBA standings because ${day.toDate()} is before ${season.startDate}`);
          return;
        }
        if (day.isAfter(season.endDate)) {
          log.info(`Not refreshing NBA standings because ${day.toDate()} is after ${season.endDate}`);
          return;
        }

        NbaGameData.ingestSeasonData();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'NbaGameData.ingestSeasonData()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Refresh MLB standings',
    schedule(parser) {
      return parser.recur().every(5).minute();
    },
    job() {
      try {
        MlbGameData.refreshStandings();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'MlbGameData.refreshStandings()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Send weekly leaderboard emails',
    schedule(parser) {
      return parser.text('at 10:02 am on Tuesday'); // 2am-ish PST
    },
    job() {
      try {
        WeeklyLeaderboardEmail.sendAll();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'WeeklyLeaderboardEmail.sendAll()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Refresh weekly games to watch',
    schedule(parser) {
      return parser.text('at 11:02 am on Tuesday'); // 3am-ish PST
    },
    job() {
      try {
        RatingCalculator.calculateAllInterestRatings();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'RatingCalculator.calculateAllInterestRatings();',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Send weekly games to watch emails',
    schedule(parser) {
      return parser.text('at 5:02 pm on Wednesday');
    },
    job() {
      try {
        WeeklyGamesToWatchEmail.sendAll();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'WeeklyGamesToWatchEmail.sendAll()',
        });
      }
    },
  });

  SyncedCron.start();
}
