import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { LeagueTeams } from '../league_teams';

Meteor.publish('leagueTeams.ofLeague', (leagueId) => {
  check(leagueId, Match.Maybe(String));
  return LeagueTeams.find({ leagueId });
});

Meteor.publish('leagueTeam.single', (leagueTeamId) => {
  check(leagueTeamId, Match.Maybe(String));
  return LeagueTeams.find(leagueTeamId);
});
