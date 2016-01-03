let prettyjson = Meteor.npmRequire( 'prettyjson' );

Modules.server.nflGameData = {
  ingestSeasonData: function (year) {
    let week = 1;
    let url = `http://www.nfl.com/ajax/scorestrip?season=${year}&seasonType=REG&week=${week}`;

    console.log(`fetching ${url}`);
    let response = HTTP.get(url);
    let xmlString = response.content;
    console.log(`xml: ${xmlString}`);

    let json = xml2js.parseStringSync(xmlString, {mergeAttrs: true, explicitArray: false});
    console.log(`parsed json: ${prettyjson.render(json)}`);

    console.log(`parsed json.ss.gms.g: ${prettyjson.render(json.ss.gms.g)}`);
    json.ss.gms.g.forEach(Modules.server.nflGameData.saveGame);

    return "all done";

    /*
     try {
     return yield ingestWeekData(year, 1);
     // sails.log("success!", message);
     } catch (err) {
     sails.log("error!", err);
     }
     */

    /*
     let weeks = [];
     for (var i = 1; i < 3; i++) weeks.push(i);
     sails.log(`weeks: ${weeks}`);
     Promise.map(weeks, function (week) {
     sails.log(`return promise for ${year}/${week}`);
     return ingestWeekData(year, week);
     });
     */
  },
  saveGame: function (game) {
    console.log(`game: ${game.eid}`);
  }
};
