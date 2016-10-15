import WeeklyGamesToWatch from '../../../api/emails/server/weekly-games-to-watch';

export default {
  path: 'weekly-games-to-watch-email/template.html',    // Relative to the 'private' dir.
  css: 'weekly-games-to-watch-email/style.css',       // Mail specific CSS.

  helpers: {
    preview() {
      return `Games to watch for ${this.poolName}`;
    },
  },

  route: {
    path: '/weekly-games-to-watch-email/pools/:poolId',
    data(params) {
      const poolId = params.poolId;

      return WeeklyGamesToWatch.getEmailData(poolId);
    },
  },
};
