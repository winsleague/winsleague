import { LeagueTeams } from './league_teams';

export default {
  getByName(league, cityName, mascotName) {
    return LeagueTeams.findOne({ leagueId: league._id, cityName, mascotName });
  },

  getByNbaNetTeamId(league, nbaNetTeamId) {
    return LeagueTeams.findOne({ leagueId: league._id, nbaNetTeamId });
  },
};
