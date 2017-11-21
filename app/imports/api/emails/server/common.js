import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';

import { PoolTeams } from '../../pool_teams/pool_teams';

export default {
  getPlayerEmails(poolId, seasonId) {
    // each userId can have multiple emails
    // each email has an address property and a verified property
    // return in the format 'name <email@domain.com>, name <email@domain.com>'
    // don't include players if they haven't drafted any teams that season

    const players = PoolTeams.find({ poolId, seasonId, teamSummary: { $ne: '' } })
      .map(poolTeam => {
        return {
          _id: poolTeam.userId,
          teamName: poolTeam.userTeamName,
        };
      });

    const emailArray = _.flatten(players.map(player => {
      return _.flatten(Meteor.users.find(player._id)
        .map(user => user.emails))
        .map(email => `${player.teamName} <${email.address}>`);
    }));

    return emailArray.join(', ');
  },
}
