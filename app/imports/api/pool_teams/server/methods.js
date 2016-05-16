import log from '../../../startup/log';

import { LeagueTeams } from '../../league_teams/league_teams';
import { PoolTeams } from '../pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';

import { PoolTeamPickMethods } from '../../pool_team_picks/server/methods';

function createOrExistingUserId(email) {
  const existingUser = Accounts.findUserByEmail(email);
  if (existingUser) {
    log.debug(`Using existingUser: ${existingUser._id}`);
    return existingUser._id;
  }

  Accounts.createUser({ email });
  const newUser = Accounts.findUserByEmail(email);
  log.debug(`Created new user: ${newUser._id}`);
  // TODO: Accounts.sendEnrollmentMail() so user can login
  return newUser._id;
}

export default {
  insertFromForm() {
    return new ValidatedMethod({
      name: 'PoolTeams.insert',
      mixins: [LoggedInMixin],
      checkLoggedInError: {
        error: 'notLoggedIn',
      },
      validate: PoolTeams.formSchema.validator(),
      run(doc) {
        let newDoc = doc;
        log.debug(`newDoc: `, newDoc);

        newDoc.userId = createOrExistingUserId(newDoc.userEmail);
        delete newDoc.userEmail;

        // trigger AutoValues
        PoolTeams.schema.clean(newDoc, {
          extendAutoValueContext: {
            isInsert: true,
            isUpdate: false,
            isUpsert: false,
            isFromTrustedCode: false,
          },
        });

        log.debug(`newDoc: `, newDoc);

        check(newDoc, PoolTeams.schema);
        return PoolTeams.insert(newDoc);
      },
    });
  },

  updateWhoPickedLeagueTeam(leagueTeamId) {
    log.info(`Finding PoolTeams who picked leagueTeamId: ${leagueTeamId}`);

    const poolTeamPicks = PoolTeamPicks.find({ leagueTeamId });
    poolTeamPicks.forEach(poolTeamPick => {
      this.updatePoolTeamWins(poolTeamPick.poolTeamId);
      this.updatePoolTeamPickQuality(poolTeamPick.poolTeamId);
    });

    log.debug(`Done finding PoolTeams who picked leagueTeamId`);
  },

  updatePoolTeamWins(poolTeamId) {
    log.info(`Updating PoolTeam wins`, poolTeamId);

    let totalWins = 0;
    let totalLosses = 0;
    let totalGames = 0;
    let totalPlusMinus = 0;

    const picks = PoolTeamPicks.find({ poolTeamId });

    picks.forEach(poolTeamPick => {
      const seasonId = poolTeamPick.seasonId;
      const leagueTeamId = poolTeamPick.leagueTeamId;
      const seasonLeagueTeam = SeasonLeagueTeams.findOne({ seasonId, leagueTeamId });
      log.debug(`Found seasonLeagueTeam`, seasonLeagueTeam);
      if (seasonLeagueTeam) {
        totalWins += seasonLeagueTeam.wins;
        totalLosses += seasonLeagueTeam.losses;
        totalGames += seasonLeagueTeam.totalGames();
        totalPlusMinus += seasonLeagueTeam.pointsFor - seasonLeagueTeam.pointsAgainst;
      }
    });

    // .direct is needed to avoid an infinite recursion loop
    // https://github.com/matb33/meteor-collection-hooks#direct-access-circumventing-hooks
    const numberAffected = PoolTeams.direct.update(poolTeamId,
      { $set: { totalWins, totalLosses, totalGames, totalPlusMinus } });
    log.debug(`PoolTeams.update ${poolTeamId} with totalWins: ${totalWins}, totalLosses: ${totalLosses}, numberAffected: ${numberAffected}`);
  },

  updatePoolTeamPickQuality(poolTeamId) {
    PoolTeamPicks.find({ poolTeamId }).forEach(poolTeamPick => {
      PoolTeamPickMethods.updatePickQuality(poolTeamPick);
    });
  },

  updateTeamSummary(poolTeamId) {
    log.info(`Updating team summary for PoolTeam:`, poolTeamId);

    let teamSummary = '';
    const picks = PoolTeamPicks.find({ poolTeamId }, { sort: { pickNumber: 1 } });
    picks.forEach(poolTeamPick => {
      const leagueTeam = LeagueTeams.findOne(poolTeamPick.leagueTeamId);
      teamSummary += `${leagueTeam.abbreviation}, `;
    });
    if (teamSummary.length > 0) {
      teamSummary = teamSummary.substr(0, teamSummary.length - 2);
    } else {
      teamSummary = 'No teams drafted!';
    }

    const numberAffected = PoolTeams.direct.update(poolTeamId,
      {
        $set: {
          teamSummary,
        },
      });
    log.debug(`PoolTeams.update ${poolTeamId} with teamSummary: ${teamSummary}, numberAffected: ${numberAffected}`);
  },
}
