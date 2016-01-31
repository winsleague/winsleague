const prettyjson = Meteor.npmRequire('prettyjson');

Modules.server.nflGameData = {
  updateLiveScores() {
    const url = `http://www.nfl.com/liveupdate/scorestrip/scorestrip.json`;
    const response = HTTP.get(url);
    log.debug(`raw content: ${response.content}`);
    let content = response.content.replace(/,,/g, ',"",');
    content = content.replace(/,,/g, ',"",'); // do it again to address multiple commas in a row
    log.debug(`fixed content: ${content}`);
    const json = JSON.parse(content);
    log.debug(`parsed json: ${prettyjson.render(json)}`);

    const league = Modules.server.nflGameData.getLeague();

    for (const gameData of json.ss) {
      // ["Sun","13:00:00","Final",,"NYJ","17","BUF","22",,,"56744",,"REG17","2015"]
      const gameId = parseInt(gameData[10], 10);
      const period = gameData[2].toLowerCase();
      const timeRemaining = gameData[3];
      const homeScore = gameData[7];
      const awayScore = gameData[5];

      const affected = Games.update({ leagueId: league._id, gameId },
        { $set: { period, timeRemaining, homeScore, awayScore } }
      );

      log.info(`Updated game with leagueId: ${league._id} and gameId: ${gameId} (affected: ${affected})`);
    }
  },

  ingestSeasonData(season) {
    if (!season) { throw new Error(`Season is null!`); }

    const league = Modules.server.nflGameData.getLeague();
    if (!league) { throw new Error(`League is not found!`); }

    Games.remove({ leagueId: league._id, seasonId: season._id });

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
    for (const game of json.ss.gms.g) {
      Modules.server.nflGameData.saveGame(game, season, week);
    }
  },

  saveGame(game, season, week) {
    log.info(`season: ${season.year}, week: ${week}, game: ${game.eid}`);
    const league = Modules.server.nflGameData.getLeague();
    const gameDate = new Date(`${game.eid.substr(0, 4)}-${game.eid.substr(4, 2)}-${game.eid.substr(6, 2)}`); // 20151224
    Games.insert({
      leagueId: league._id,
      seasonId: season._id,
      gameId: game.gsis,
      gameDate,
      week,
      homeTeamId: LeagueTeams.findOne({ leagueId: league._id, abbreviation: game.h })._id,
      homeScore: game.hs,
      awayTeamId: LeagueTeams.findOne({ leagueId: league._id, abbreviation: game.v })._id,
      awayScore: game.vs,
      period: Modules.server.nflGameData.cleanPeriod(game.q),
      status: Modules.server.nflGameData.cleanStatus(game.q),
    });
  },

  getLeague() {
    return Leagues.findOne({ name: 'NFL' });
  },

  getSeason(year = (new Date()).getFullYear()) {
    const league = Modules.server.nflGameData.getLeague();
    if (!league) { throw new Error(`NFL League not found!`); }
    return Seasons.findOne({ leagueId: league._id, year });
  },

  cleanPeriod(old) {
    if (old === 'P') { return 'pregame'; }
    if (old === 'O') { return 'overtime'; }
    if (old === 'F') { return 'final'; }
    if (old === 'FO') { return 'final overtime'; }
    return old;
  },

  cleanStatus(old) {
    if (old === 'P') { return 'scheduled'; }
    if (old === 'F' || old === 'FO') { return 'completed'; }
    return 'in progress';
  },
};
