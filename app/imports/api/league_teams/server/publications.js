import { Meteor } from 'meteor/meteor';

import { LeagueTeams } from '../league_teams';

Meteor.publish('leagueTeams.ofLeague', leagueId => {
  check(leagueId, String);
  return LeagueTeams.find({ leagueId });
});
