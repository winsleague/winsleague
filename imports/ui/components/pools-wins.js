import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { _ } from 'lodash';
import log from '../../utils/log';

import { Pools } from '../../api/pools/pools';
import { PoolTeams } from '../../api/pool_teams/pool_teams';

import './pools-wins.html';

Template.Pools_wins.helpers({
  poolTeams: () => {
    const seasonId = Template.currentData().seasonId;
    const poolId = Template.currentData().poolId;
    return PoolTeams.find({ poolId, seasonId }, {
      sort: {
        totalWins: -1,
        totalGames: 1,  // if two teams are tied in wins,
                        // rank the one with fewest games played higher
        totalPlusMinus: -1,
        userTeamName: 1, // just in case everyone is tied, let's sort predictably
      },
    });
  },

  title: () => {
    const title = Template.currentData().title;
    if (Template.currentData().linkTitle) {
      const path = FlowRouter.path('Pools.show', { poolId: Template.currentData().poolId });
      return `<a href="${path}">${title}</a>`;
    }
    return title;
  },

  isCommissioner: () => Meteor.userId() === _.get(Template.instance().getPool(),
    'commissionerUserId'),

  myTeamClass: (poolTeamId) => {
    if (poolTeamId === Template.instance().getMyPoolTeamId()) {
      return 'info';
    }
    return '';
  },
});

Template.Pools_wins.onCreated(function () {
  const schema = new SimpleSchema({
    title: { type: String, optional: true, defaultValue: 'Wins Leaderboard' },
    linkTitle: { type: Boolean, optional: true, defaultValue: false },
    poolId: { type: String },
    seasonId: { type: String },
    isCommissioner: { type: Boolean, optional: true, defaultValue: false },
    poolTeamId: { type: String, optional: true },
  });
  schema.clean(this.data, { mutate: true });
  schema.validate(this.data);

  this.getPool = () => Pools.findOne(this.data.poolId);

  this.getMyPoolTeamId = () => {
    if (this.data.poolTeamId) {
      return this.data.poolTeamId;
    }

    const poolTeam = PoolTeams.findOne({
      poolId: this.data.poolId,
      seasonId: this.data.seasonId,
      userId: Meteor.userId(),
    });
    return _.get(poolTeam, '_id');
  };

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.data.poolId, this.data.seasonId, () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });
  });
});
