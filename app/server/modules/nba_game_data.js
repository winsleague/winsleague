const prettyjson = Meteor.npmRequire('prettyjson');

Modules.server.nbaGameData = {
  ingestSeasonData(season) {
    const league = Modules.leagues.getByName('NBA');
    if (! league) throw new Error(`League is not found!`);

    if (! season) season = Modules.seasons.getLatestByLeague(league);

    const url = `https://erikberg.com/nba/standings.json`;

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url, {
      headers: { 'user-agent': 'Meteor/1.2 (https://github.com/league-wins-pool/league-wins-pool)' },
    });
    // clean the JSON because the keys don't have quotes
    const cleanJSON = response.content.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?: /g, '"$2": ');
    log.debug(`cleanJSON: ${cleanJSON}`);
    const parsedJSON = JSON.parse(cleanJSON);

    log.debug(`parsedJSON.standing: `, parsedJSON.standing);
    parsedJSON.standing.forEach(teamData => {
      log.debug(`teamData: `, teamData);
      Modules.server.nbaGameData.saveTeam(league, season, teamData);
    });
  },

  saveTeam(league, season, teamData) {
    const leagueTeam = Modules.leagueTeams.getByName(
      league, teamData.first_name, teamData.last_name);
    if (! leagueTeam) throw new Error(`Unable to find team! ${prettyjson.render(teamData)}`);

    SeasonLeagueTeams.upsert(
      { leagueId: league._id, seasonId: season._id, leagueTeamId: leagueTeam._id },
      { $set: {
        wins: teamData.won, losses: teamData.lost, ties: 0,
        homeWins: teamData.home_won, homeLosses: teamData.home_lost, homeTies: 0,
        awayWins: teamData.away_won, awayLosses: teamData.away_lost, awayTies: 0,
        pointsFor: teamData.points_for, pointsAgainst: teamData.points_against,
      } });
  },
};
