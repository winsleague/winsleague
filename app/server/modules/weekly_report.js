Modules.server.weeklyReport = {
  emailReports() {
    const seasonIds = Modules.server.weeklyReport.findActiveSeasons();
    seasonIds.forEach(seasonId => {
      const poolIds = Modules.server.weeklyReport.findEligiblePools(seasonId);
      poolIds.forEach(poolId => {
        Modules.server.weeklyReport.emailReport(seasonId, poolId);
      });
    });
  },

  emailReport(seasonId, poolId) {

  },

  findActiveSeasons() {
    const today = new Date();
    return Seasons.find({
      startDate: {
        $lte: today,
      },
      endDate: {
        $gte: today,
      },
    });
  },

  findEligiblePools(seasonId) {
    PoolTeams.aggregate([
      {
        $group: {
          _id: null,
          resTime: {
            $sum: "$resTime"
          }
        }
      }
    ])
  },
};
