import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import log from '../../utils/log';

import { Games } from '../../api/games/games';
import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';
import { PoolGameInterestRatings } from '../../api/pool_game_interest_ratings/pool_game_interest_ratings';

import './pools-games-to-watch.html';

function myTeamClassHelper(leagueTeamId, myScore, theirScore) {
  if (_.includes(Template.instance().getMyLeagueTeams(), leagueTeamId)) {
    if (myScore > theirScore) {
      return 'success';
    } else if (myScore < theirScore) {
      return 'danger';
    }
    return 'info';
  }
  return '';
}

Template.Pools_games_to_watch.helpers({
  games: () => Games.find(
    {
      seasonId: Template.currentData().seasonId,
    },
    {
      sort: {
        gameDate: 1,
        gameId: 1,
      },
    }),

  poolId: () => Template.currentData().poolId,

  seasonId: () => Template.currentData().seasonId,

  myTeamClass: (game, isHomeTeam) => {
    if (isHomeTeam) {
      return myTeamClassHelper(game.homeTeamId, game.homeScore, game.awayScore);
    }
    return myTeamClassHelper(game.awayTeamId, game.awayScore, game.homeScore);
  },

  poolGameInterestRatings: () => {
    const poolId = Template.currentData().poolId;
    return PoolGameInterestRatings.find({ poolId }, {
      sort: {
        rating: -1,
      },
    });
  },
});

Template.Pools_games_to_watch.onCreated(function () {
  const schema = new SimpleSchema({
    leagueId: { type: String },
    seasonId: { type: String },
    poolId: { type: String },
    poolTeamId: { type: String, optional: true },
    includeInterestRatings: { type: Boolean, defaultValue: true },
  });
  schema.clean(this.data, { mutate: true });
  schema.validate(this.data);

  this.getMyLeagueTeams = () => {
    const poolTeamPicks = PoolTeamPicks.find({
      poolTeamId: this.data.poolTeamId,
    });
    return poolTeamPicks.map(poolTeamPick => poolTeamPick.leagueTeamId);
  };

  this.autorun(() => {
    this.subscribe('seasonLeagueTeams.ofLeagueSeason', this.data.leagueId, this.data.seasonId, () => {
      this.subscribe('myGames.ofPoolTeam', this.data.poolTeamId, () => {
        log.debug(`myGames.ofPoolTeam subscription ready: ${Games.find().count()}`);
      });

      this.subscribe('poolTeams.ofPool', this.data.poolId, this.data.seasonId);

      this.subscribe('poolTeamPicks.ofPool', this.data.poolId, this.data.seasonId, () => {
        log.debug(`poolTeamPicks.ofPoolTeam subscription ready: ${PoolTeamPicks.find().count()}`);
      });

      if (this.data.includeInterestRatings) {
        this.subscribe('poolGameInterestRatings.ofPool', this.data.poolId, () => {
          log.debug(`poolGameInterestRatings.of_pool subscription ready: ${PoolGameInterestRatings.find().count()}`);
        });
      }
    });
  });
});
