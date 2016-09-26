import { Pools } from '../../../api/pools/pools';
import { PoolTeams } from '../../../api/pool_teams/pool_teams';
import { PoolTeamPicks } from '../../../api/pool_team_picks/pool_team_picks';
import { LeagueTeams } from '../../../api/league_teams/league_teams';

export default {
  path: 'weekly-leaderboard-email/template.html',    // Relative to the 'private' dir.
  css: 'weekly-leaderboard-email/style.css',       // Mail specific CSS.

  helpers: {
    preview() {
      return `Weekly Wins Leaderboard for ${this.poolName}`;
    },
  },

  route: {
    path: '/weekly-leaderboard-email/pools/:poolId/seasons/:seasonId',
    data(params) {
      const poolId = params.poolId;
      const seasonId = params.seasonId;
      const pool = Pools.findOne(poolId);
      const poolName = pool.name;
      const poolTeams = PoolTeams.find(
        {
          poolId,
          seasonId,
        },
        {
          sort: {
            totalWins: -1,
            totalPlusMinus: -1,
          },
        });

      const bestPick = PoolTeamPicks.findOne(
        {
          seasonId,
          poolId,
        },
        {
          sort: {
            pickQuality: -1,
          },
        });
      const bestPickPoolTeam = PoolTeams.findOne(bestPick.poolTeamId);
      const bestPickLeagueTeam = LeagueTeams.findOne(bestPick.leagueTeamId);

      const worstPick = PoolTeamPicks.findOne(
        {
          seasonId,
          poolId,
        },
        {
          sort: {
            pickQuality: 1,
          },
        });
      const worstPickPoolTeam = PoolTeams.findOne(worstPick.poolTeamId);
      const worstPickLeagueTeam = LeagueTeams.findOne(worstPick.leagueTeamId);

      return {
        poolId,
        seasonId,
        poolName,
        poolTeams,
        bestPick,
        bestPickPoolTeam,
        bestPickLeagueTeam,
        worstPick,
        worstPickPoolTeam,
        worstPickLeagueTeam,
      };
    },
  },
};
