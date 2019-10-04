import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { _ } from 'lodash';
import log from '../../utils/log';

import './pool-team-picks-show-page.html';

import '../components/pools-header';

import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';
import { LeagueTeams } from '../../api/league_teams/league_teams';
import { SeasonLeagueTeams } from '../../api/season_league_teams/season_league_teams';
import { Games } from '../../api/games/games';

Template.PoolTeamPicks_show_page.helpers({
  seasonLeagueTeamId: () => Template.instance().getSeasonLeagueTeamId(),

  leagueId: () => Template.instance().getLeagueId(),

  seasonId: () => Template.instance().getSeasonId(),

  poolId: () => Template.instance().getPoolId(),

  leagueTeamName: (leagueTeamId) => {
    const team = LeagueTeams.findOne(leagueTeamId);
    if (team) return team.abbreviation;
    return '';
  },

  games: () => Games.find({
    seasonId: Template.instance().getSeasonId(),
    $or: [
      {
        homeTeamId: Template.instance().getLeagueTeamId(),
      },
      {
        awayTeamId: Template.instance().getLeagueTeamId(),
      },
    ],
  },
  {
    sort: {
      gameDate: 1,
    },
  }),
});

Template.PoolTeamPicks_show_page.onCreated(function () {
  this.getPoolTeamPickId = () => FlowRouter.getParam('poolTeamPickId');
  this.getPoolTeamPick = () => PoolTeamPicks.findOne(this.getPoolTeamPickId());

  this.getLeagueId = () => _.get(this.getPoolTeamPick(), 'leagueId');
  this.getSeasonId = () => _.get(this.getPoolTeamPick(), 'seasonId');
  this.getLeagueTeamId = () => _.get(this.getPoolTeamPick(), 'leagueTeamId');
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getSeasonLeagueTeamId = () => SeasonLeagueTeams.find({
    seasonId: this.getSeasonId(),
    leagueTeamId: this.getLeagueTeamId(),
  });

  this.autorun(() => {
    this.subscribe('poolTeamPicks.single', this.getPoolTeamPickId(), () => {
      log.debug('poolTeamPicks.single subscription ready');

      this.subscribe('poolTeamPicks.ofPool', this.getPoolId(), this.getSeasonId(), () => {
        this.subscribe('poolTeams.ofPool', this.getPoolId(), this.getSeasonId(), () => {
          this.subscribe('games.ofSeasonLeagueTeam', this.getSeasonId(), this.getLeagueTeamId());
        });
      });

      this.subscribe('seasonLeagueTeams.ofLeagueSeason', this.getLeagueId(), this.getSeasonId());

      this.subscribe('leagueTeam.single', this.getLeagueTeamId());
    });
  });
});
