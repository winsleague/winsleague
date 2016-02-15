const prettyjson = Meteor.npmRequire('prettyjson');

Modules.server.mlbGameData = {
  ingestSeasonData() {
    const league = Modules.leagues.getByName('MLB');
    if (! league) { throw new Error(`League is not found!`); }

    const season = Modules.seasons.getLatestByLeague(league);

    Games.remove({ leagueId: league._id, seasonId: season._id });

    const startDate = moment(`${season.year}-03-01`, 'YYYY-MM-DD');
    const endDate = moment(`${season.year}-10-31`, 'YYYY-MM-DD');

    for (const date = startDate; date.isBefore(endDate); date.add(1, 'days')) {
      // month is zero-indexed so we add 1
      Modules.server.mlbGameData.ingestDayData(league, season, date.year(), date.month() + 1, date.date());
    }
  },

  ingestDayData(league, season, year, month, day) {
    log.debug(month);
    log.debug(`day: `, day);
    const url = `http://gd2.mlb.com/components/game/mlb/year_${year}/month_${padZeros(month, 2)}/day_${padZeros(day, 2)}/miniscoreboard.json`;
    log.debug(`url: `, url);
    const response = HTTP.get(url);
    const parsedJSON = JSON.parse(response.content);
    log.debug(`json: `, parsedJSON);

    if (! parsedJSON.data.games.game) return; // no games on that day

    parsedJSON.data.games.game.forEach(game => {
      log.debug(`game: `, game);
      Modules.server.mlbGameData.insertGame(league, season, game);
    });
  },

  insertGame(league, season, game) {
    if (game.game_type !== 'R') {
      /*
       game_types:
         E -- Exhibition
         S -- Spring Training
         R -- Regular Season
         A -- All Star Game
         F -- Wildcard
         D -- Division Series (ALDS / NLDS)
         L -- League Series (ALCS / NLCS)
         W -- World Series
        */
      return;
    }

    log.info(`game: ${game.gameday_link}`);
    const gameDate = moment.tz(`${game.time_date} ${game.ampm}`, 'YYYY/MM/DD HH:MM A', 'EST'); // all times are in EST
    Games.insert({
      leagueId: league._id,
      seasonId: season._id,
      gameId: game.gameday_link,
      gameDate,
      homeTeamId: getLeagueTeamIdByAbbreviation(game.home_name_abbrev),
      awayTeamId: getLeagueTeamIdByAbbreviation(game.away_name_abbrev),
      period: 'pregame',
      status: 'scheduled',
    });
  },
};

function getLeagueTeamIdByAbbreviation(abbreviation) {
  return LeagueTeams.findOne({ leagueId: league._id, abbreviation })._id
}

function padZeros(n, width) {
  const nAsString = n + '';
  return nAsString.length >= width ? nAsString : new Array(width - nAsString.length + 1).join('0') + nAsString;
}
