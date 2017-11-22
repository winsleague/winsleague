import log from '../../utils/log';

import { Factory } from 'meteor/dburles:factory';
import { SeasonLeagueTeams } from './season_league_teams';
import { Seasons } from '../seasons/seasons';
import { LeagueTeams } from '../league_teams/league_teams';

import '../leagues/leagues_factory';
import '../seasons/seasons_factory';
import '../league_teams/league_teams_factory';

Factory.define('seasonLeagueTeam', SeasonLeagueTeams, {
  leagueId: Factory.get('league'),
  seasonId: Factory.get('season'),
  leagueTeamId: Factory.get('leagueTeam'),
  abbreviation: 'NYG',
}).after(factory => {
  const season = Seasons.findOne(factory.seasonId);
  season.leagueId = factory.leagueId;
  Seasons.update(season._id,
    {
      $set: {
        leagueId: factory.leagueId,
      },
    });

  const leagueTeam = LeagueTeams.findOne(factory.leagueTeamId);
  leagueTeam.leagueId = factory.leagueId;
  LeagueTeams.update(leagueTeam._id,
    {
      $set: {
        leagueId: factory.leagueId,
      },
    });

  log.debug('seasonLeagueTeam factory created:', factory);
});
