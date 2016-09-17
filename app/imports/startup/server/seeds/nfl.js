import moment from 'moment';

import Utils from './utils';
import LeagueFinder from '../../../api/leagues/finder';

import { Leagues } from '../../../api/leagues/leagues';
import { LeagueTeams } from '../../../api/league_teams/league_teams';
import { Seasons } from '../../../api/seasons/seasons';
import { LeaguePickExpectedWins } from '../../../api/league_pick_expected_wins/league_pick_expected_wins';

export default {
  create() {
    this.createLeague();
    this.createTeams();
    this.createSeasons();
    this.createExpectedWins();
  },

  createLeague() {
    Utils.removeLeague('NFL');

    Leagues.insert({
      name: 'NFL',
      seasonGameCount: 16,
    });
  },

  createTeams() {
    const leagueId = LeagueFinder.getIdByName('NFL');
    const teams = [
      {
        cityName: 'Baltimore', mascotName: 'Ravens', abbreviation: 'BAL',
        conference: 'AFC', division: 'North',
      },
      {
        cityName: 'Cincinnati', mascotName: 'Bengals', abbreviation: 'CIN',
        conference: 'AFC', division: 'North',
      },
      {
        cityName: 'Cleveland', mascotName: 'Browns', abbreviation: 'CLE',
        conference: 'AFC', division: 'North',
      },
      {
        cityName: 'Pittsburgh', mascotName: 'Steelers', abbreviation: 'PIT',
        conference: 'AFC', division: 'North',
      },
      {
        cityName: 'Houston', mascotName: 'Texans', abbreviation: 'HOU',
        conference: 'AFC', division: 'South',
      },
      {
        cityName: 'Indianapolis', mascotName: 'Colts', abbreviation: 'IND',
        conference: 'AFC', division: 'South',
      },
      {
        cityName: 'Jacksonville', mascotName: 'Jaguars', abbreviation: 'JAC',
        conference: 'AFC', division: 'South',
      },
      {
        cityName: 'Tennessee', mascotName: 'Titans', abbreviation: 'TEN',
        conference: 'AFC', division: 'South',
      },
      {
        cityName: 'Buffalo', mascotName: 'Bills', abbreviation: 'BUF',
        conference: 'AFC', division: 'East',
      },
      {
        cityName: 'Miami', mascotName: 'Dolphins', abbreviation: 'MIA',
        conference: 'AFC', division: 'East',
      },
      {
        cityName: 'New England', mascotName: 'Patriots', abbreviation: 'NE',
        conference: 'AFC', division: 'East',
      },
      {
        cityName: 'New York', mascotName: 'Jets', abbreviation: 'NYJ',
        conference: 'AFC', division: 'East',
      },
      {
        cityName: 'Denver', mascotName: 'Broncos', abbreviation: 'DEN',
        conference: 'AFC', division: 'West',
      },
      {
        cityName: 'Kansas City', mascotName: 'Chiefs', abbreviation: 'KC',
        conference: 'AFC', division: 'West',
      },
      {
        cityName: 'Oakland', mascotName: 'Raiders', abbreviation: 'OAK',
        conference: 'AFC', division: 'West',
      },
      {
        cityName: 'San Diego', mascotName: 'Chargers', abbreviation: 'SD',
        conference: 'AFC', division: 'West',
      },
      {
        cityName: 'Chicago', mascotName: 'Bears', abbreviation: 'CHI',
        conference: 'NFC', division: 'North',
      },
      {
        cityName: 'Detroit', mascotName: 'Lions', abbreviation: 'DET',
        conference: 'NFC', division: 'North',
      },
      {
        cityName: 'Green Bay', mascotName: 'Packers', abbreviation: 'GB',
        conference: 'NFC', division: 'North',
      },
      {
        cityName: 'Minnesota', mascotName: 'Vikings', abbreviation: 'MIN',
        conference: 'NFC', division: 'North',
      },
      {
        cityName: 'Atlanta', mascotName: 'Falcons', abbreviation: 'ATL',
        conference: 'NFC', division: 'South',
      },
      {
        cityName: 'Carolina', mascotName: 'Panthers', abbreviation: 'CAR',
        conference: 'NFC', division: 'South',
      },
      {
        cityName: 'New Orleans', mascotName: 'Saints', abbreviation: 'NO',
        conference: 'NFC', division: 'South',
      },
      {
        cityName: 'Tampa Bay', mascotName: 'Buccaneers', abbreviation: 'TB',
        conference: 'NFC', division: 'South',
      },
      {
        cityName: 'Dallas', mascotName: 'Cowboys', abbreviation: 'DAL',
        conference: 'NFC', division: 'East',
      },
      {
        cityName: 'New York', mascotName: 'Giants', abbreviation: 'NYG',
        conference: 'NFC', division: 'East',
      },
      {
        cityName: 'Philadelphia', mascotName: 'Eagles', abbreviation: 'PHI',
        conference: 'NFC', division: 'East',
      },
      {
        cityName: 'Washington', mascotName: 'Redskins', abbreviation: 'WAS',
        conference: 'NFC', division: 'East',
      },
      {
        cityName: 'Arizona', mascotName: 'Cardinals', abbreviation: 'ARI',
        conference: 'NFC', division: 'West',
      },
      {
        cityName: 'San Francisco', mascotName: '49ers', abbreviation: 'SF',
        conference: 'NFC', division: 'West',
      },
      {
        cityName: 'Seattle', mascotName: 'Seahawks', abbreviation: 'SEA',
        conference: 'NFC', division: 'West',
      },
      {
        cityName: 'Los Angeles', mascotName: 'Rams', abbreviation: 'LA',
        conference: 'NFC', division: 'West',
      },
    ];
    for (const team of teams) {
      team.leagueId = leagueId;
      LeagueTeams.insert(team);
    }
  },

  createSeasons() {
    const leagueId = LeagueFinder.getIdByName('NFL');
    Seasons.insert({ leagueId, year: 2014,
      startDate: moment('2014-09-04').toDate(),
      endDate: moment('2015-12-28').toDate(),
    });
    Seasons.insert({ leagueId, year: 2015,
      startDate: moment('2015-09-10').toDate(),
      endDate: moment('2016-01-03').toDate(),
    });
  },

  createExpectedWins() {
    const leagueId = LeagueFinder.getIdByName('NFL');
    const expectedWins = [
      13.77,
      12.85,
      12.46,
      12.08,
      11.54,
      11.00,
      10.62,
      10.38,
      10.23,
      9.77,
      9.54,
      9.38,
      9.08,
      8.62,
      8.38,
      8.31,
      7.85,
      7.62,
      7.38,
      7.08,
      6.77,
      6.69,
      6.31,
      6.00,
      5.54,
      5.08,
      4.62,
      4.38,
      4.00,
      3.62,
      2.85,
      1.85,
    ];
    expectedWins.forEach((element, index) => {
      LeaguePickExpectedWins.insert({ leagueId, rank: index + 1, wins: element });
    });
  },
};
