let prettyjson = Meteor.npmRequire( 'prettyjson' );

Modules.server.nflGameData = {
  updateScores() {
    const url = `http://www.nfl.com/liveupdate/scorestrip/scorestrip.json`;
    const response = HTTP.get(url);
    log.debug(`raw content: ${response.content}`);
    let content = response.content.replace(/,,/g, ",\"\",");
    content = content.replace(/,,/g, ",\"\","); // do it again to address multiple commas in a row
    log.debug(`fixed content: ${content}`);
    const json = JSON.parse(content);
    log.debug(`parsed json: ${prettyjson.render(json)}`);

    const league = Modules.server.nflGameData.getLeague();

    for (let gameData of json.ss) {
      // ["Sun","13:00:00","Final",,"NYJ","17","BUF","22",,,"56744",,"REG17","2015"]
      const gsis = parseInt(gameData[10]);
      const quarter = gameData[2];
      const timeRemaining = gameData[3];
      const homeScore = gameData[5];
      const visitorScore = gameData[7];

      const affected = NflGames.update({ leagueId: league._id, gsis: gsis },
        { $set: { quarter: quarter, timeRemaining: timeRemaining, homeScore: homeScore, visitorScore: visitorScore } }
      );

      log.info(`Updated game with leagueId: ${league._id} and gsis: ${gsis} (affected: ${affected})`);
    }
  },

  ingestSeasonData(season) {
    if (season == null) { throw new Error(`Season is null!`) }

    const league = Modules.server.nflGameData.getLeague();
    NflGames.remove({ leagueId: league._id, seasonId: season._id });

    for (let week = 1; week <= 17; week++) {
      Modules.server.nflGameData.ingestWeekData(season, week);
    }
  },

  ingestWeekData(season, week) {
    const url = `http://www.nfl.com/ajax/scorestrip?season=${season.year}&seasonType=REG&week=${week}`;

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url);
    const xmlString = response.content;
    log.debug(`xml: ${xmlString}`);

    const json = xml2js.parseStringSync(xmlString, { mergeAttrs: true, explicitArray: false });
    log.debug(`parsed json: ${prettyjson.render(json)}`);

    log.debug(`parsed json.ss.gms.g: ${prettyjson.render(json.ss.gms.g)}`);
    for (let game of json.ss.gms.g) {
      Modules.server.nflGameData.saveGame(game, season, week);
    }
  },

  saveGame(game, season, week) {
    log.info(`season: ${season.year}, week: ${week}, game: ${game.eid}`);
    const league = Modules.server.nflGameData.getLeague();
    NflGames.insert({
      leagueId: league._id,
      seasonId: season._id,
      week, week,
      eid: game.eid,
      gsis: game.gsis,
      day: game.d,
      time: game.t,
      quarter: game.q,
      homeTeamId: LeagueTeams.findOne({ leagueId: league._id, abbreviation: game.h })._id,
      homeScore: game.hs,
      visitorTeamId: LeagueTeams.findOne({ leagueId: league._id, abbreviation: game.v })._id,
      visitorScore: game.vs
    });
  },

  getLeague() {
    return Leagues.findOne({ name: "NFL" });
  },

  getSeason(year = (new Date()).getFullYear()) {
    const league = Modules.server.nflGameData.getLeague();
    return Seasons.findOne({ leagueId: league._id, year: year })
  }
};
