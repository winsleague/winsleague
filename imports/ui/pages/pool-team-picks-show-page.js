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

const completedGames = () => Games.find({
  seasonId: Template.instance().getSeasonId(),
  status: 'completed',
  $or: [
    {
      homeTeamId: Template.instance().getLeagueTeamId(),
    },
    {
      awayTeamId: Template.instance().getLeagueTeamId(),
    },
  ],
});

const upcomingGames = () => Games.find({
  seasonId: Template.instance().getSeasonId(),
  status: { $ne: 'completed' },
  $or: [
    {
      homeTeamId: Template.instance().getLeagueTeamId(),
    },
    {
      awayTeamId: Template.instance().getLeagueTeamId(),
    },
  ],
});

const opponentsRecord = (games) => {
  const thisLeagueTeamId = Template.instance().getLeagueTeamId();
  const seasonId = Template.instance().getSeasonId();

  const opponentsOfGamesPlayed = [];
  games.forEach((game) => {
    if (game.homeTeamId === thisLeagueTeamId) {
      opponentsOfGamesPlayed.push(game.awayTeamId);
    } else {
      opponentsOfGamesPlayed.push(game.homeTeamId);
    }
  });

  const seasonLeagueTeams = SeasonLeagueTeams.find({
    seasonId,
    leagueTeamId: { $in: opponentsOfGamesPlayed },
  });

  let wins = 0;
  let losses = 0;
  let ties = 0;
  seasonLeagueTeams.forEach((seasonLeagueTeam) => {
    wins += seasonLeagueTeam.wins;
    losses += seasonLeagueTeam.losses;
    ties += seasonLeagueTeam.ties;
  });

  if (ties === 0) {
    return `${wins}-${losses}`;
  }
  return `${wins}-${losses}-${ties}`;
};


Template.PoolTeamPicks_show_page.helpers({
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

  currentRecord: () => {
    const seasonLeagueTeam = SeasonLeagueTeams.findOne({
      seasonId: Template.instance().getSeasonId(),
      leagueTeamId: Template.instance().getLeagueTeamId(),
    });

    return seasonLeagueTeam.record();
  },

  opponentsRecordOfCompletedGames: () => opponentsRecord(completedGames()),

  opponentsRecordOfUpcomingGames: () => opponentsRecord(upcomingGames()),
});

Template.PoolTeamPicks_show_page.onCreated(function () {
  this.getPoolTeamPickId = () => FlowRouter.getParam('poolTeamPickId');
  this.getPoolTeamPick = () => PoolTeamPicks.findOne(this.getPoolTeamPickId());

  this.getLeagueId = () => _.get(this.getPoolTeamPick(), 'leagueId');
  this.getSeasonId = () => _.get(this.getPoolTeamPick(), 'seasonId');
  this.getLeagueTeamId = () => _.get(this.getPoolTeamPick(), 'leagueTeamId');
  this.getPoolId = () => FlowRouter.getParam('poolId');

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