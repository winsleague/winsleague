let prettyjson = Meteor.npmRequire( 'prettyjson' );

Modules.server.nflGameData = {
  ingestSeasonData(season) {
    if (season == null) { throw new Error(`Season is null!`) }

    let league = Modules.server.nflGameData.getLeague();
    Games.remove({ leagueId: league._id, seasonId: season._id });

    for (let week = 1; week <= 17; week++) {
      Modules.server.nflGameData.ingestWeekData(season, week);
    }
  },

  ingestWeekData(season, week) {
    let url = `http://www.nfl.com/ajax/scorestrip?season=${season.year}&seasonType=REG&week=${week}`;

    log.debug(`fetching ${url}`);
    let response = HTTP.get(url);
    let xmlString = response.content;
    log.debug(`xml: ${xmlString}`);

    let json = xml2js.parseStringSync(xmlString, { mergeAttrs: true, explicitArray: false });
    log.debug(`parsed json: ${prettyjson.render(json)}`);

    log.debug(`parsed json.ss.gms.g: ${prettyjson.render(json.ss.gms.g)}`);
    for (let game of json.ss.gms.g) {
      Modules.server.nflGameData.saveGame(game, season, week);
    }
  },

  saveGame(game, season, week) {
    log.info(`season: ${season.year}, week: ${week}, game: ${game.eid}`);
    let league = Modules.server.nflGameData.getLeague();
    Games.insert({
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
    let league = Modules.server.nflGameData.getLeague();
    return Seasons.findOne({ leagueId: league._id, year: year })
  }
};
