import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import log from '../../utils/log';

import { Games } from '../../api/games/games';
import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';
import { PoolTeams } from '../../api/pool_teams/pool_teams';
import { PoolGameInterestRatings } from '../../api/pool_game_interest_ratings/pool_game_interest_ratings';

import './games-item';

import './pools-games-to-watch.html';

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
    },
  ),

  gameArgs: (game) => {
    const {
      seasonId, poolId, poolTeamId, includeInterestRatings,
    } = Template.currentData();
    return {
      gameId: game._id,
      seasonId,
      poolId,
      poolTeamId,
      myLeagueTeamIds: Template.instance().getMyLeagueTeamIds(),
      includeInterestRatings,
    };
  },

  poolId: () => Template.currentData().poolId,

  seasonId: () => Template.currentData().seasonId,

  poolGameInterestRatings: () => {
    const { poolId } = Template.currentData();
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

  this.getMyLeagueTeamIds = () => {
    const poolTeam = PoolTeams.findOne({
      seasonId: this.data.seasonId,
      userId: Meteor.userId(),
    });
    const poolTeamPicks = PoolTeamPicks.find({
      poolTeamId: _.get(poolTeam, '_id'),
    });
    return poolTeamPicks.map((poolTeamPick) => poolTeamPick.leagueTeamId);
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
