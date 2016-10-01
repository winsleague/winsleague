import WeeklyLeaderboardEmail from '../../../api/emails/server/weekly-leaderboard-email';

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

      return WeeklyLeaderboardEmail.getEmailData(poolId, seasonId);
    },
  },
};
