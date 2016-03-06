Modules.server.weeklyReport = {
  emailReports() {
    log.info(`Sending out weekly email report`);

    const seasons = Modules.server.weeklyReport.findActiveSeasons();
    seasons.forEach(season => {
      const poolIds = Modules.server.weeklyReport.findEligiblePoolIds(season._id);
      poolIds.forEach(poolId => {
        Modules.server.weeklyReport.emailReport(poolId, season._id);
      });
    });
  },

  emailReport(poolId, seasonId) {
    log.info(`Emailing weekly report to pool ${poolId} for season ${seasonId}`);

    const pool = Pools.findOne(poolId);
    const poolName = pool.name;
    const poolTeams = PoolTeams.find({ poolId, seasonId },
      { sort: { totalWins: -1, totalPlusMinus: -1 } });

    Mailer.send({
      to: 'noahsw@gmail.com',           // 'To: ' address. Required.
      subject: `Wins Leaderboard for ${poolName}`,
      template: 'weeklyEmail',               // Required.
      data: {
        poolId,
        seasonId,
        poolName,
        poolTeams,
      },
    });
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

  findEligiblePoolIds(seasonId) {
    const poolAggregation = PoolTeams.aggregate([
      {
        $match: {
          seasonId,
        },
      },
      {
        $group: {
          _id: '$poolId',
          poolId: { $first: '$poolId' },
        },
      },
    ]);
    return poolAggregation.map(result => result._id);
  },
};
