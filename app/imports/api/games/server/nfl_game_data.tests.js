/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import NflGameData from './nfl_game_data';
import NflUtils from '../../../startup/server/seeds/nfl';
import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';
import { Games } from '../../games/games';

import { assert } from 'chai';
import sinon from 'sinon';

describe('NFL Game Data', () => {
  beforeEach(() => {
    NflUtils.create();

    const league = LeagueFinder.getByName('NFL');
    const season = SeasonFinder.getByYear(league, 2015);
    const week = 17;

    // it'd be great if this could be pulled from an external file but I couldn't figure out
    // how to get it to copy the external js file to the mirror
    sinon.stub(HTTP, 'get', function (url) {
      if (url === `http://www.nfl.com/ajax/scorestrip?season=${season.year}&seasonType=REG&week=${week}`) {
        return {
          content: `<?xml version="1.0" encoding="UTF-8"?>
<ss><gms gd="0" w="17" y="2015" t="R"><g eid="2016010300" gsis="56744" d="Sun" t="1:00" q="2" k="" h="BUF" hnn="bills" hs="10" v="NYJ" vnn="jets" vs="7" p="" rz="" ga="" gt="REG"/><g eid="2016010302" gsis="56747" d="Sun" t="1:00" q="F" k="" h="CIN" hnn="bengals" hs="24" v="BAL" vnn="ravens" vs="16" p="" rz="" ga="" gt="REG"/><g eid="2016010303" gsis="56748" d="Sun" t="1:00" q="F" k="" h="CLE" hnn="browns" hs="12" v="PIT" vnn="steelers" vs="28" p="" rz="" ga="" gt="REG"/><g eid="2016010304" gsis="56751" d="Sun" t="1:00" q="F" k="" h="HOU" hnn="texans" hs="30" v="JAC" vnn="jaguars" vs="6" p="" rz="" ga="" gt="REG"/><g eid="2016010305" gsis="56752" d="Sun" t="1:00" q="F" k="" h="IND" hnn="colts" hs="30" v="TEN" vnn="titans" vs="24" p="" rz="" ga="" gt="REG"/><g eid="2016010307" gsis="56749" d="Sun" t="1:00" q="F" k="" h="DAL" hnn="cowboys" hs="23" v="WAS" vnn="redskins" vs="34" p="" rz="" ga="" gt="REG"/><g eid="2016010308" gsis="56755" d="Sun" t="1:00" q="F" k="" h="NYG" hnn="giants" hs="30" v="PHI" vnn="eagles" vs="35" p="" rz="" ga="" gt="REG"/><g eid="2016010309" gsis="56746" d="Sun" t="1:00" q="F" k="" h="CHI" hnn="bears" hs="20" v="DET" vnn="lions" vs="24" p="" rz="" ga="" gt="REG"/><g eid="2016010311" gsis="56743" d="Sun" t="1:00" q="F" k="" h="ATL" hnn="falcons" hs="17" v="NO" vnn="saints" vs="20" p="" rz="" ga="" gt="REG"/><g eid="2016010301" gsis="56754" d="Sun" t="1:00" q="F" k="" h="MIA" hnn="dolphins" hs="20" v="NE" vnn="patriots" vs="10" p="" rz="" ga="" gt="REG"/><g eid="2016010315" gsis="56758" d="Sun" t="4:25" q="FO" k="" h="SF" hnn="49ers" hs="19" v="STL" vnn="rams" vs="16" p="" rz="" ga="" gt="REG"/><g eid="2016010306" gsis="56753" d="Sun" t="4:25" q="F" k="" h="KC" hnn="chiefs" hs="23" v="OAK" vnn="raiders" vs="17" p="" rz="" ga="" gt="REG"/><g eid="2016010312" gsis="56745" d="Sun" t="4:25" q="F" k="" h="CAR" hnn="panthers" hs="38" v="TB" vnn="buccaneers" vs="10" p="" rz="" ga="" gt="REG"/><g eid="2016010313" gsis="56757" d="Sun" t="4:25" q="F" k="" h="DEN" hnn="broncos" hs="27" v="SD" vnn="chargers" vs="20" p="" rz="" ga="" gt="REG"/><g eid="2016010314" gsis="56756" d="Sun" t="4:25" q="F" k="" h="ARI" hnn="cardinals" hs="6" v="SEA" vnn="seahawks" vs="36" p="" rz="" ga="" gt="REG"/><g eid="2016010310" gsis="56750" d="Sun" t="8:30" q="F" k="" h="GB" hnn="packers" hs="13" v="MIN" vnn="vikings" vs="20" p="" rz="" ga="" gt="REG"/></gms></ss>`
        };
      }
      if (url === 'http://www.nfl.com/liveupdate/scorestrip/scorestrip.json') {
        return {
          content: `{"ss":[["Sun","13:00:00","Final",,"NO","20","ATL","17",,,"56743",,"REG17","2015"],["Sun","13:00:00","Final",,"NYJ","17","BUF","22",,,"56744",,"REG17","2015"],["Sun","13:00:00","Final",,"DET","24","CHI","20",,,"56746",,"REG17","2015"],["Sun","13:00:00","Final",,"BAL","16","CIN","24",,,"56747",,"REG17","2015"],["Sun","13:00:00","Final",,"PIT","28","CLE","12",,,"56748",,"REG17","2015"],["Sun","13:00:00","Final",,"WAS","34","DAL","23",,,"56749",,"REG17","2015"],["Sun","13:00:00","Final",,"JAC","6","HOU","30",,,"56751",,"REG17","2015"],["Sun","13:00:00","Final",,"TEN","24","IND","30",,,"56752",,"REG17","2015"],["Sun","13:00:00","Final",,"NE","10","MIA","20",,,"56754",,"REG17","2015"],["Sun","13:00:00","Final",,"PHI","35","NYG","30",,,"56755",,"REG17","2015"],["Sun","16:25:00","Final",,"SEA","36","ARI","6",,,"56756",,"REG17","2015"],["Sun","16:25:00","Final",,"TB","10","CAR","38",,,"56745",,"REG17","2015"],["Sun","16:25:00","Final",,"SD","20","DEN","27",,,"56757",,"REG17","2015"],["Sun","16:25:00","Final",,"OAK","17","KC","23",,,"56753",,"REG17","2015"],["Sun","16:25:00","final overtime",,"STL","16","SF","19",,,"56758",,"REG17","2015"],["Sun","20:30:00","Final",,"MIN","20","GB","13",,,"56750",,"REG17","2015"]]}`
        };
      }
    });

    NflGameData.ingestWeekData(season, week);
  });

  afterEach(() => {
    HTTP.get.restore();
  });

  describe('Ingest Week Data', () => {
    it('should ingest all games for week 17', () => {
      const game = Games.findOne({ gameId: '56744' });
      assert.equal(game.homeScore, 10);
      assert.equal(game.awayScore, 7);
    });
  });

  describe('Update Live Scores', () => {
    it('should update the games based on live scores', () => {
      NflGameData.updateLiveScores();

      const game = Games.findOne({ gameId: '56744' });
      assert.equal(game.homeScore, 22);
      assert.equal(game.awayScore, 17);
    });
  });
});
