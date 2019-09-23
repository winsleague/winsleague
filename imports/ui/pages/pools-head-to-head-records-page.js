import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { _ } from 'lodash';
import log from '../../utils/log';

import './pools-head-to-head-records-page.html';

import '../components/pools-header';
import '../components/pools-season-switcher';
import '../components/pools-head-to-head-records';

import { Pools } from '../../api/pools/pools';
import { PoolTeams } from '../../api/pool_teams/pool_teams';
import SeasonFinder from '../../api/seasons/finder';

Template.Pools_head_to_head_records_page.helpers({
  poolId: () => Template.instance().getPoolId(),

  seasonId: () => Template.instance().getSeasonId(),

  leagueId: () => Template.instance().getLeagueId(),

  isLatestSeason: () => {
    if (Template.instance().getSeasonId()) {
      const latestSeason = SeasonFinder.getLatestByLeagueId(Template.instance().getLeagueId());
      return _.get(latestSeason, '_id') === Template.instance().getSeasonId();
    }
    return true;
  },

  myPoolTeamId: () => Template.instance().getMyPoolTeamId(),
});

Template.Pools_head_to_head_records_page.onCreated(function () {
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
    });

    this.subscribe('poolTeams.ofPool', this.getPoolId(), this.getSeasonId());

    this.subscribe('seasons.single', this.getSeasonId());

    this.subscribe('seasons.latest.ofLeague', this.getLeagueId());
  });
});
