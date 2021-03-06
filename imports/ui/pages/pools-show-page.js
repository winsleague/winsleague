import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import store from 'store';
import { _ } from 'lodash';
import log from '../../utils/log';

import './pools-show-page.html';

import '../components/pools-header';
import '../components/pools-pick-quality';
import '../components/pools-season-switcher';
import '../components/pools-games-to-watch';
import '../components/pools-head-to-head-records';

import { Pools } from '../../api/pools/pools';
import { PoolTeams } from '../../api/pool_teams/pool_teams';
import SeasonFinder from '../../api/seasons/finder';

Template.Pools_show_page.helpers({
  poolId: () => Template.instance().getPoolId(),

  seasonId: () => Template.instance().getSeasonId(),

  leagueId: () => Template.instance().getLeagueId(),

  isCommissioner: () => Meteor.userId() === _.get(Template.instance().getPool(),
    'commissionerUserId'),

  isLatestSeason: () => {
    if (Template.instance().getSeasonId()) {
      const latestSeason = SeasonFinder.getLatestByLeagueId(Template.instance().getLeagueId());
      return _.get(latestSeason, '_id') === Template.instance().getSeasonId();
    }
    return true;
  },

  myPoolTeamId: () => Template.instance().getMyPoolTeamId(),
});

Template.Pools_show_page.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getSeasonId = () => {
    const seasonId = FlowRouter.getParam('seasonId');
    if (seasonId) {
      return seasonId;
    }
    return _.get(this.getPool(), 'latestSeasonId');
  };

  this.getMyPoolTeamId = () => {
    const poolTeam = PoolTeams.findOne({
      seasonId: this.getSeasonId(),
      userId: Meteor.userId(),
    });
    return _.get(poolTeam, '_id');
  };

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn('poolsShow: Redirecting to /?force=true because Pools.count=0');
        FlowRouter.go('/?force=true');
      }

      // this is so we can suggest to users on the homepage where to find
      // the pool they were looking at
      store.set('previousPoolId', this.getPoolId());
    });

    this.subscribe('poolTeams.ofPool', this.getPoolId(), this.getSeasonId());

    this.subscribe('seasons.single', this.getSeasonId());

    this.subscribe('seasons.latest.ofLeague', this.getLeagueId());
  });
});
