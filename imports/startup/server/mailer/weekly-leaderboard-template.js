import WeeklyLeaderboardEmail from '../../../api/emails/server/weekly-leaderboard-email';

export default {
  name: 'weekly-leaderboard-email',
  path: 'weekly-leaderboard-email/template.html', // Relative to the 'private' dir.

  helpers: {
    preview() {
      return `Weekly Wins Leaderboard for ${this.poolName}`;
    },
  },

  route: {
    path: '/weekly-leaderboard-email/pools/:poolId/seasons/:seasonId',
    data(params) {
      const { poolId } = params;
      const { seasonId } = params;

      return WeeklyLeaderboardEmail.getEmailData(poolId, seasonId);
    },
  },
};
