import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import log from '../../utils/log';

import { LeagueTeams } from './league_teams';
import '../leagues/leagues_factory';

Factory.define('leagueTeam', LeagueTeams, {
  leagueId: Factory.get('league'),
  cityName: () => faker.address.city(),
  mascotName: () => faker.company.companyName(),
  abbreviation: () => faker.lorem.words(1),
  conference: 'NFC',
  division: 'East',
}).after(leagueTeam => {
  log.debug('leagueTeam factory created:', leagueTeam);
});

Factory.define('awayLeagueTeam', LeagueTeams, {
  leagueId: Factory.get('league'),
  cityName: () => faker.address.city(),
  mascotName: () => faker.company.companyName(),
  abbreviation: () => faker.lorem.words(1),
  conference: 'AFC',
  division: 'South',
}).after(awayLeagueTeam => {
  log.debug('awayLeagueTeam factory created:', awayLeagueTeam);
});
