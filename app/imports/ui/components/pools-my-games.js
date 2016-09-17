import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import log from '../../utils/log';

import { Games } from '../../api/games/games';

import './pools-my-games.html';

Template.Pools_my_games.helpers({
  myGames: () => {
    return Games.find({}, {
      sort: {
        gameDate: 1,
      },
    });
  },

  poolId: () => Template.currentData().poolId,

  seasonId: () => Template.currentData().seasonId,
});

Template.Pools_my_games.onCreated(function () {
  new SimpleSchema({
    leagueId: { type: String, optional: true },
    seasonId: { type: String, optional: true },
    poolId: { type: String, optional: true },
    poolTeamId: { type: String, optional: true },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('leagueTeams.ofLeague', this.data.leagueId, () => {
      this.subscribe('relevantGames.ofPoolTeamId', this.data.poolTeamId, () => {
        log.info(`relevantGames.ofPoolTeamId subscription ready: ${Games.find().count()}`);
      });
    });
  });
});
