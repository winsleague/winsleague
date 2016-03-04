Templates = {};

Templates.weekly = {
  path: 'weekly-email/template.html',    // Relative to the 'private' dir.
  scss: 'weekly-email/style.scss',       // Mail specific SCSS.

  helpers: {

  },

  route: {
    path: '/weekly/pools/:poolId/seasons/:seasonId',
    data(params) {
      const poolId = params.poolId;
      const seasonId = params.seasonId;
      const poolTeams = PoolTeams.find({ poolId, seasonId },
        { sort: { totalWins: -1, totalPlusMinus: -1 } });
      return {
        poolTeams,
      };
    },
  },
};
