import { PoolTeams } from '../../pool_teams/pool_teams';
import log from '../../../utils/log';

export default {
  updateRankings(poolId, seasonId) {
    log.info('Updating Pool ranking', poolId);

    const poolTeams = PoolTeams.find({ poolId, seasonId }, {
      sort: {
        totalWins: -1,
        totalGames: 1, // if two teams are tied in wins, rank the one with fewest games played higher
        totalPlusMinus: -1,
        userTeamName: 1, // just in case everyone is tied, let's sort predictably
      },
    });

    let currentRanking = 1;
    poolTeams.forEach((poolTeam) => {
      PoolTeams.direct.update(poolTeam._id, {
        $set: {
          currentRanking,
        },
      });
      currentRanking += 1;
    });
  },
};
