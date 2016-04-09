function getLeagueTeamIdByAbbreviation(league, abbreviation) {
  return LeagueTeams.findOne({ leagueId: league._id, abbreviation })._id;
}

function padZeros(n, width) {
  const nAsString = n + '';
  return nAsString.length >= width ? nAsString : new Array(width - nAsString.length + 1).join('0') + nAsString;
}

function cleanStatus(status) {
  // 'scheduled', 'in progress', 'completed', 'postponed', 'suspended', 'cancelled'],
  switch (status) {
    case 'Preview':
    case 'Warmup':
    case 'Pre-Game': // not sure how any of these are different
      return 'scheduled';
    case 'In Progress':
    case 'Manager Challenge':
      return 'in progress';
    case 'Final':
    case 'Game Over':
      return 'completed'; // not sure how any of these are different
    case 'Postponed':
      return 'postponed';
    case 'Completed Early':
      return 'suspended';
    default:
      throw new Error(`Unrecognized status: ${status}`);
  }
}

function parseGameDate(timeDate, ampm) {
  // time_date: 2016/04/03 1:05
  // ampm: PM
  // all times are in EST
  return moment.tz(new Date(`${timeDate} ${ampm}`), 'US/Eastern').toDate();
}


Modules.server.mlbGameData = {
  ingestSeasonData(season) {
    const league = Modules.leagues.getByName('MLB');
    if (! league) throw new Error(`League is not found!`);

    if (! season) season = Modules.seasons.getLatestByLeague(league);

    const startDate = moment(season.startDate);
    const endDate = moment(season.endDate);

    for (const date = startDate; date.isBefore(endDate); date.add(1, 'days')) {
      // month is zero-indexed so we add 1
      Modules.server.mlbGameData.ingestDayData(league, season, date.year(), date.month() + 1, date.date());
    }
  },

  ingestDayData(league, season, year, month, day) {
    const url = `http://gd2.mlb.com/components/game/mlb/year_${year}/month_${padZeros(month, 2)}/day_${padZeros(day, 2)}/miniscoreboard.json`;
    log.debug(`url: `, url);
    const response = HTTP.get(url);
    const parsedJSON = JSON.parse(response.content);
    log.debug(`json: `, parsedJSON);

    if (! parsedJSON.data.games.game) return; // no games on that day

    if (Array.isArray(parsedJSON.data.games.game)) {
      parsedJSON.data.games.game.forEach(game => {
        Modules.server.mlbGameData.upsertGame(league, season, game);
      });
    } else { // this happens when there's only one game that day (http://gd2.mlb.com/components/game/mlb/year_2016/month_07/day_12/miniscoreboard.json)
      Modules.server.mlbGameData.upsertGame(league, season, parsedJSON.data.games.game);
    }
  },

  upsertGame(league, season, game) {
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

    const values = {
      gameDate: parseGameDate(game.time_date, game.ampm),
      homeTeamId: getLeagueTeamIdByAbbreviation(league, game.home_name_abbrev),
      homeScore: _.get(game, 'home_team_runs', 0),
      awayTeamId: getLeagueTeamIdByAbbreviation(league, game.away_name_abbrev),
      awayScore: _.get(game, 'away_team_runs', 0),
      period: _.get(game, 'inning', 'pregame'),
      status: cleanStatus(game.status),
    };

    log.info(`Updating game with raw data:`, game, `to clean values:`, values);
    Games.upsert(
      {
        leagueId: league._id,
        seasonId: season._id,
        gameId: game.gameday_link,
      },
      {
        $set: values,
      }
    );
  },

  refreshStandings() {
    const league = Modules.leagues.getByName('MLB');
    if (! league) throw new Error(`League is not found!`);
    const season = Modules.seasons.getLatestByLeague(league);

    let day = moment();

    // if early in the morning, download yesterday's feed to make sure we got all the late games
    if (day.hour() < 6) day = moment().add(-1, 'days');

    // only run during season
    if (day.isBefore(season.startDate)) {
      log.info(`Not refreshing MLB standings because ${day.toDate()} is before ${season.startDate}`);
      return;
    }
    if (day.isAfter(season.endDate)) {
      log.info(`Not refreshing MLB standings because ${day.toDate()} is after ${season.endDate}`);
      return;
    }

    const year = day.year();
    const month = day.month() + 1; // moment months are zero-based
    const date = day.date();

    Modules.server.mlbGameData.ingestDayData(league, season, year, month, date);
  },
};

Meteor.methods({
  'mlbGameData.ingestSeasonData': Modules.server.mlbGameData.ingestSeasonData,
});
