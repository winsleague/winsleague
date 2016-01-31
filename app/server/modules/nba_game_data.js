const prettyjson = Meteor.npmRequire('prettyjson');

Modules.server.nbaGameData = {
  ingestSeasonData() {
    const league = Modules.leagues.getByName('NBA');
    if (!league) { throw new Error(`League is not found!`); }

    const season = Modules.seasons.getLatest(league);

    const url = `https://erikberg.com/nba/standings.json`;

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url, {
      headers: { 'user-agent': 'Meteor/1.2 (https://github.com/league-wins-pool/league-wins-pool)' },
    });
    const json = JSON.parse(response.content);

    log.debug(`json.standing: `, json.standing);
    json.standing.forEach(teamData => {
      log.debug(`teamData: `, teamData);
      Modules.server.nbaGameData.saveTeam(league, season, teamData);
    });
  },

  saveTeam(league, season, teamData) {
    const leagueTeam = Modules.leagueTeams.getLeagueTeam(league, teamData.first_name, teamData.last_name);
    if (!leagueTeam) {
      throw new Error(`Unable to find team! ${prettyjson.render(teamData)}`);
    }

    SeasonLeagueTeams.upsert({ leagueId: league._id, seasonId: season._id, leagueTeamId: leagueTeam._id },
      { $set: {
        wins: teamData.won, losses: teamData.lost, ties: 0,
        homeWins: teamData.home_won, homeLosses: teamData.home_lost, homeTies: 0,
        awayWins: teamData.away_won, awayLosses: teamData.away_lost, awayTies: 0,
        pointsFor: teamData.points_for, pointsAgainst: teamData.points_against,
      } });
  },
};
