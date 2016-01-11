describe("NFL Game Data", function() {
  beforeEach(function() {
    const season = Modules.server.nflGameData.getSeason(2015);
    const week = 3;

    // it'd be great if this could be pulled from an external file but I couldn't figure out
    // how to get it to copy the external js file to the mirror
    spyOn(HTTP, 'get').and.callFake(function(url) {
      if (url == "http://www.nfl.com/ajax/scorestrip?season=2015&seasonType=REG&week=3") {
        return {
          content: `<?xml version="1.0" encoding="UTF-8"?>
<ss><gms gd="0" w="3" y="2015" t="R"><g eid="2015092400" gsis="56535" d="Thu" t="8:25" q="F" k="" h="NYG" hnn="giants" hs="32" v="WAS" vnn="redskins" vs="21" p="" rz="" ga="" gt="REG"/><g eid="2015092700" gsis="56539" d="Sun" t="1:00" q="F" k="" h="DAL" hnn="cowboys" hs="28" v="ATL" vnn="falcons" vs="39" p="" rz="" ga="" gt="REG"/><g eid="2015092701" gsis="56537" d="Sun" t="1:00" q="F" k="" h="CAR" hnn="panthers" hs="27" v="NO" vnn="saints" vs="22" p="" rz="" ga="" gt="REG"/><g eid="2015092702" gsis="56543" d="Sun" t="1:00" q="F" k="" h="NYJ" hnn="jets" hs="17" v="PHI" vnn="eagles" vs="24" p="" rz="" ga="" gt="REG"/><g eid="2015092703" gsis="56540" d="Sun" t="1:00" q="F" k="" h="HOU" hnn="texans" hs="19" v="TB" vnn="buccaneers" vs="9" p="" rz="" ga="" gt="REG"/><g eid="2015092704" gsis="56541" d="Sun" t="1:00" q="F" k="" h="MIN" hnn="vikings" hs="31" v="SD" vnn="chargers" vs="14" p="" rz="" ga="" gt="REG"/><g eid="2015092705" gsis="56544" d="Sun" t="1:00" q="F" k="" h="STL" hnn="rams" hs="6" v="PIT" vnn="steelers" vs="12" p="" rz="" ga="" gt="REG"/><g eid="2015092706" gsis="56542" d="Sun" t="1:00" q="F" k="" h="NE" hnn="patriots" hs="51" v="JAC" vnn="jaguars" vs="17" p="" rz="" ga="" gt="REG"/><g eid="2015092707" gsis="56536" d="Sun" t="1:00" q="F" k="" h="BAL" hnn="ravens" hs="24" v="CIN" vnn="bengals" vs="28" p="" rz="" ga="" gt="REG"/><g eid="2015092708" gsis="56538" d="Sun" t="1:00" q="F" k="" h="CLE" hnn="browns" hs="20" v="OAK" vnn="raiders" vs="27" p="" rz="" ga="" gt="REG"/><g eid="2015092709" gsis="56545" d="Sun" t="1:00" q="F" k="" h="TEN" hnn="titans" hs="33" v="IND" vnn="colts" vs="35" p="" rz="" ga="" gt="REG"/><g eid="2015092710" gsis="56546" d="Sun" t="4:05" q="F" k="" h="ARI" hnn="cardinals" hs="47" v="SF" vnn="49ers" vs="7" p="" rz="" ga="" gt="REG"/><g eid="2015092711" gsis="56548" d="Sun" t="4:25" q="F" k="" h="SEA" hnn="seahawks" hs="26" v="CHI" vnn="bears" vs="0" p="" rz="" ga="" gt="REG"/><g eid="2015092712" gsis="56547" d="Sun" t="4:25" q="F" k="" h="MIA" hnn="dolphins" hs="14" v="BUF" vnn="bills" vs="41" p="" rz="" ga="" gt="REG"/><g eid="2015092713" gsis="56549" d="Sun" t="8:30" q="F" k="" h="DET" hnn="lions" hs="12" v="DEN" vnn="broncos" vs="24" p="" rz="" ga="" gt="REG"/><g eid="2015092800" gsis="56550" d="Mon" t="8:30" q="F" k="" h="GB" hnn="packers" hs="38" v="KC" vnn="chiefs" vs="28" p="" rz="" ga="" gt="REG"/></gms></ss>`
        }
      }
      if (url == "http://www.nfl.com/liveupdate/scorestrip/scorestrip.json") {
        return {
          content: `{"ss":[["Sun","13:00:00","Final",,"NO","20","ATL","17",,,"56743",,"REG17","2015"],["Sun","13:00:00","Final",,"NYJ","17","BUF","22",,,"56744",,"REG17","2015"],["Sun","13:00:00","Final",,"DET","24","CHI","20",,,"56746",,"REG17","2015"],["Sun","13:00:00","Final",,"BAL","16","CIN","24",,,"56747",,"REG17","2015"],["Sun","13:00:00","Final",,"PIT","28","CLE","12",,,"56748",,"REG17","2015"],["Sun","13:00:00","Final",,"WAS","34","DAL","23",,,"56749",,"REG17","2015"],["Sun","13:00:00","Final",,"JAC","6","HOU","30",,,"56751",,"REG17","2015"],["Sun","13:00:00","Final",,"TEN","24","IND","30",,,"56752",,"REG17","2015"],["Sun","13:00:00","Final",,"NE","10","MIA","20",,,"56754",,"REG17","2015"],["Sun","13:00:00","Final",,"PHI","35","NYG","30",,,"56755",,"REG17","2015"],["Sun","16:25:00","Final",,"SEA","36","ARI","6",,,"56756",,"REG17","2015"],["Sun","16:25:00","Final",,"TB","10","CAR","38",,,"56745",,"REG17","2015"],["Sun","16:25:00","Final",,"SD","20","DEN","27",,,"56757",,"REG17","2015"],["Sun","16:25:00","Final",,"OAK","17","KC","23",,,"56753",,"REG17","2015"],["Sun","16:25:00","final overtime",,"STL","16","SF","19",,,"56758",,"REG17","2015"],["Sun","20:30:00","Final",,"MIN","20","GB","13",,,"56750",,"REG17","2015"]]}`
        };
      }
    });

    Modules.server.nflGameData.ingestWeekData(season, week);
  });

  afterEach(function() {
    Games.remove({});
    SeasonLeagueTeams.remove({});
  });

  describe("Ingest Season Data", function() {
    it ("should ingest all games for the year", function() {
      expect(Games.find().count()).toBeGreaterThan(0);
    });
  });

  describe("Update Live Scores", function() {
    it ("should update the games based on live scores", function() {
      Modules.server.nflGameData.updateLiveScores();
      expect(Games.find().count()).toBeGreaterThan(0);
    });
  });
});
