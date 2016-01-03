let prettyjson = Meteor.npmRequire( 'prettyjson' );

Modules.server.nflGameData = {
  ingestSeasonData(year) {
    let week = 1;
    let url = `http://www.nfl.com/ajax/scorestrip?season=${year}&seasonType=REG&week=${week}`;

    log.debug(`fetching ${url}`);
    let response = HTTP.get(url);
    let xmlString = response.content;
    log.debug(`xml: ${xmlString}`);

    let json = xml2js.parseStringSync(xmlString, { mergeAttrs: true, explicitArray: false });
    log.debug(`parsed json: ${prettyjson.render(json)}`);

    log.debug(`parsed json.ss.gms.g: ${prettyjson.render(json.ss.gms.g)}`);
    json.ss.gms.g.forEach(Modules.server.nflGameData.saveGame);
  },

  saveGame(game) {
    log.info(`game: ${game.eid}`);
  }
};
