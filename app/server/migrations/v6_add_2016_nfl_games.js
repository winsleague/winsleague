import { Migrations } from 'meteor/percolate:migrations';
import log from '../../imports/utils/log';
import NflGameData from '../../imports/api/games/server/nfl_game_data';
import LeagueFinder from '../../imports/api/leagues/finder';
import SeasonFinder from '../../imports/api/seasons/finder';
import { Games } from '../../imports/api/games/games';

Migrations.add({
  version: 6,
  name: 'Adds 2016 games to NFL',
  up: () => {
    const season = SeasonFinder.getByYear('NFL', 2016);

    NflGameData.ingestSeasonData(season);
  },
  down: () => {
    const league = LeagueFinder.getByName('NFL');
    const season = SeasonFinder.getByYear('NFL', 2016);

    Games.remove({ leagueId: league._id, seasonId: season._id });
  },
});
