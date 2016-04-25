import log from '../../../startup/log';

import LeagueMethods from '../../leagues/methods';

import { LeagueTeams } from '../../league_teams/league_teams';
import { Games } from '../games';

function cleanPeriod(old) {
  if (old === 'P') { return 'pregame'; }
  if (old === 'O') { return 'overtime'; }
  if (old === 'F') { return 'final'; }
  if (old === 'FO') { return 'final overtime'; }
  return old;
}

function cleanStatus(old) {
  if (old === 'P') { return 'scheduled'; }
  if (old === 'F' || old === 'FO') { return 'completed'; }
  return 'in progress';
}

export default {
  updateLiveScores() {
    const url = `http://www.nfl.com/liveupdate/scorestrip/scorestrip.json`;
    const response = HTTP.get(url);
    log.debug(`raw content: ${response.content}`);
    let content = response.content.replace(/,,/g, ',"",');
    content = content.replace(/,,/g, ',"",'); // do it again to address multiple commas in a row
    log.debug(`fixed content: ${content}`);
    const json = JSON.parse(content);
    log.debug('parsed json:', json);

    const league = LeagueMethods.getByName('NFL');

    for (const gameData of json.ss) {
      // ["Sun","13:00:00","Final",,"NYJ","17","BUF","22",,,"56744",,"REG17","2015"]
      const gameId = gameData[10];
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
    if (! season) throw new Error(`Season is null!`);

    const league = LeagueMethods.getByName('NFL');
    if (! league) throw new Error(`League is not found!`);

    Games.remove({ leagueId: league._id, seasonId: season._id });

    for (let week = 1; week <= 17; week++) {
      this.ingestWeekData(season, week);
    }
  },

  ingestWeekData(season, week) {
    const url = `http://www.nfl.com/ajax/scorestrip?season=${season.year}&seasonType=REG&week=${week}`;

    log.debug(`fetching ${url}`);
    const response = HTTP.get(url);
    const xmlString = response.content;
    log.debug(`xml: ${xmlString}`);

    const json = xml2js.parseStringSync(xmlString, { mergeAttrs: true, explicitArray: false });
    log.debug('parsed json:', json);

    log.debug('parsed json.ss.gms.g:', json.ss.gms.g);
    for (const game of json.ss.gms.g) {
      this.saveGame(game, season, week);
    }
  },

  saveGame(game, season, week) {
    log.info(`season: ${season.year}, week: ${week}, game: ${game.eid}`);
    const league = LeagueMethods.getByName('NFL');
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
      period: cleanPeriod(game.q),
      status: cleanStatus(game.q),
    });
  },
};
