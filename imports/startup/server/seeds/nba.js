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
    Utils.removeLeague('NBA');

    Leagues.insert({
      name: 'NBA',
      seasonGameCount: 82,
      closeScore: 3,
    });
  },

  teams() {
    return [
      {
        cityName: 'Atlanta', mascotName: 'Hawks', abbreviation: 'ATL',
        conference: 'East', division: 'Southeast',
        nbaNetTeamId: 1610612737,
      },
      {
        cityName: 'Boston', mascotName: 'Celtics', abbreviation: 'BOS',
        conference: 'East', division: 'Atlantic',
        nbaNetTeamId: 1610612738,
      },
      {
        cityName: 'Brooklyn', mascotName: 'Nets', abbreviation: 'BKN',
        conference: 'East', division: 'Atlantic',
        nbaNetTeamId: 1610612751,
      },
      {
        cityName: 'Charlotte', mascotName: 'Hornets', abbreviation: 'CHA',
        conference: 'East', division: 'Southeast',
        nbaNetTeamId: 1610612766,
      },
      {
        cityName: 'Chicago', mascotName: 'Bulls', abbreviation: 'CHI',
        conference: 'East', division: 'Central',
        nbaNetTeamId: 1610612741,
      },
      {
        cityName: 'Cleveland', mascotName: 'Cavaliers', abbreviation: 'CLE',
        conference: 'East', division: 'Central',
        nbaNetTeamId: 1610612739,
      },
      {
        cityName: 'Dallas', mascotName: 'Mavericks', abbreviation: 'DAL',
        conference: 'West', division: 'Southwest',
        nbaNetTeamId: 1610612742,
      },
      {
        cityName: 'Denver', mascotName: 'Nuggets', abbreviation: 'DEN',
        conference: 'West', division: 'Northwest',
        nbaNetTeamId: 1610612743,
      },
      {
        cityName: 'Detroit', mascotName: 'Pistons', abbreviation: 'DET',
        conference: 'East', division: 'Central',
        nbaNetTeamId: 1610612765,
      },
      {
        cityName: 'Golden State', mascotName: 'Warriors', abbreviation: 'GS',
        conference: 'West', division: 'Pacific',
        nbaNetTeamId: 1610612744,
      },
      {
        cityName: 'Houston', mascotName: 'Rockets', abbreviation: 'HOU',
        conference: 'West', division: 'Southwest',
        nbaNetTeamId: 1610612745,
      },
      {
        cityName: 'Indiana', mascotName: 'Pacers', abbreviation: 'IND',
        conference: 'East', division: 'Central',
        nbaNetTeamId: 1610612754,
      },
      {
        cityName: 'Los Angeles', mascotName: 'Clippers', abbreviation: 'LAC',
        conference: 'West', division: 'Pacific',
        nbaNetTeamId: 1610612746,
      },
      {
        cityName: 'Los Angeles', mascotName: 'Lakers', abbreviation: 'LAL',
        conference: 'West', division: 'Pacific',
        nbaNetTeamId: 1610612747,
      },
      {
        cityName: 'Memphis', mascotName: 'Grizzlies', abbreviation: 'MEM',
        conference: 'West', division: 'Southwest',
        nbaNetTeamId: 1610612763,
      },
      {
        cityName: 'Miami', mascotName: 'Heat', abbreviation: 'MIA',
        conference: 'East', division: 'Southeast',
        nbaNetTeamId: 1610612748,
      },
      {
        cityName: 'Milwaukee', mascotName: 'Bucks', abbreviation: 'MIL',
        conference: 'East', division: 'Central',
        nbaNetTeamId: 1610612749,
      },
      {
        cityName: 'Minnesota', mascotName: 'Timberwolves', abbreviation: 'MIN',
        conference: 'West', division: 'Northwest',
        nbaNetTeamId: 1610612750,
      },
      {
        cityName: 'New Orleans', mascotName: 'Pelicans', abbreviation: 'NO',
        conference: 'West', division: 'Southwest',
        nbaNetTeamId: 1610612740,
      },
      {
        cityName: 'New York', mascotName: 'Knicks', abbreviation: 'NY',
        conference: 'East', division: 'Atlantic',
        nbaNetTeamId: 1610612752,
      },
      {
        cityName: 'Oklahoma City', mascotName: 'Thunder', abbreviation: 'OKC',
        conference: 'West', division: 'Northwest',
        nbaNetTeamId: 1610612760,
      },
      {
        cityName: 'Orlando', mascotName: 'Magic', abbreviation: 'ORL',
        conference: 'East', division: 'Southeast',
        nbaNetTeamId: 1610612753,
      },
      {
        cityName: 'Philadelphia', mascotName: '76ers', abbreviation: 'PHI',
        conference: 'East', division: 'Atlantic',
        nbaNetTeamId: 1610612755,
      },
      {
        cityName: 'Phoenix', mascotName: 'Suns', abbreviation: 'PHO',
        conference: 'West', division: 'Pacific',
        nbaNetTeamId: 1610612756,
      },
      {
        cityName: 'Portland', mascotName: 'Trail Blazers', abbreviation: 'POR',
        conference: 'West', division: 'Northwest',
        nbaNetTeamId: 1610612757,
      },
      {
        cityName: 'Sacramento', mascotName: 'Kings', abbreviation: 'SAC',
        conference: 'West', division: 'Pacific',
        nbaNetTeamId: 1610612758,
      },
      {
        cityName: 'San Antonio', mascotName: 'Spurs', abbreviation: 'SA',
        conference: 'West', division: 'Southwest',
        nbaNetTeamId: 1610612759,
      },
      {
        cityName: 'Toronto', mascotName: 'Raptors', abbreviation: 'TOR',
        conference: 'East', division: 'Atlantic',
        nbaNetTeamId: 1610612761,
      },
      {
        cityName: 'Utah', mascotName: 'Jazz', abbreviation: 'UTA',
        conference: 'West', division: 'Northwest',
        nbaNetTeamId: 1610612762,
      },
      {
        cityName: 'Washington', mascotName: 'Wizards', abbreviation: 'WAS',
        conference: 'East', division: 'Southeast',
        nbaNetTeamId: 1610612764,
      },
    ];
  },

  createTeams() {
    const leagueId = LeagueFinder.getIdByName('NBA');
    const teams = this.teams();
    for (const team of teams) {
      team.leagueId = leagueId;
      LeagueTeams.insert(team);
    }
  },

  createSeasons() {
    const leagueId = LeagueFinder.getIdByName('NBA');
    Seasons.insert({ leagueId, year: 2015,
      startDate: moment('2015-10-27').toDate(),
      endDate: moment('2016-04-13').toDate(),
    });
  },

  createExpectedWins() {
    const leagueId = LeagueFinder.getIdByName('NBA');
    const expectedWins = [
      63.10,
      59.70,
      57.00,
      54.90,
      53.20,
      52.50,
      51.80,
      50.10,
      48.50,
      47.30,
      46.20,
      45.30,
      44.00,
      42.60,
      41.40,
      40.50,
      39.40,
      37.70,
      36.20,
      35.00,
      33.30,
      31.80,
      30.50,
      28.70,
      26.90,
      25.40,
      24.20,
      22.80,
      19.70,
      16.20,
    ];
    expectedWins.forEach((element, index) => {
      LeaguePickExpectedWins.insert({ leagueId, rank: index + 1, wins: element });
    });
  },
};
