import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { SeasonLeagueTeams } from '../season_league_teams';

Meteor.publish('seasonLeagueTeams.ofLeagueSeason', (leagueId, seasonId) => {
  check(leagueId, Match.Maybe(String));
  check(seasonId, Match.Maybe(String));
  return SeasonLeagueTeams.find({ leagueId, seasonId });
});
