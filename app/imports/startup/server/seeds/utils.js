import log from '../../../utils/log';

import LeagueFinder from '../../../api/leagues/finder';
import NFL from './nfl';
import NBA from './nba';
import MLB from './mlb';

import { Games } from '../../../api/games/games';
import { LeagueTeams } from '../../../api/league_teams/league_teams';
import { PoolTeams } from '../../../api/pool_teams/pool_teams';
import { Pools } from '../../../api/pools/pools';
import { SeasonLeagueTeams } from '../../../api/season_league_teams/season_league_teams';
import { Seasons } from '../../../api/seasons/seasons';
import { Leagues } from '../../../api/leagues/leagues';

export default {
  initializeLeagues() {
    log.info('Initializing leagues and teams');

    if (!LeagueFinder.getByName('NFL')) NFL.create();
    if (!LeagueFinder.getByName('NBA')) NBA.create();
    if (!LeagueFinder.getByName('MLB')) MLB.create();
  },

  removeLeague(leagueName) {
    const league = LeagueFinder.getByName(leagueName);
    if (!league) return;
    const leagueId = league._id;
    Games.remove({ leagueId });
    LeagueTeams.remove({ leagueId });
    PoolTeams.remove({ leagueId });
    Pools.remove({ leagueId });
    SeasonLeagueTeams.remove({ leagueId });
    Seasons.remove({ leagueId });
    Leagues.remove({ _id: leagueId });
  },
};
