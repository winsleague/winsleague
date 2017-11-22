/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import sinon from 'sinon';

import NbaGameData from './nba_game_data';
import NbaSeeds from '../../../startup/server/seeds/nba';
import LeagueFinder from '../../leagues/finder';
import LeagueTeamFinder from '../../league_teams/finder';
import SeasonFinder from '../../seasons/finder';
import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';

describe('NBA Game Data', function () {
  this.timeout(10000);

  beforeEach(() => {
    NbaSeeds.create();

    // it'd be great if this could be pulled from an external file but I couldn't figure out
    // how to get it to copy the external js file to the mirror
    sinon.stub(HTTP, 'get', function () {
      return {
        content: `{
standings_date: "2016-01-30T22:44:00-05:00",
standing: [
{
rank: 1,
won: 34,
lost: 12,
streak: "W4",
ordinal_rank: "1st",
first_name: "Cleveland",
last_name: "Cavaliers",
team_id: "cleveland-cavaliers",
games_back: 0,
points_for: 4700,
points_against: 4430,
home_won: 19,
home_lost: 3,
away_won: 15,
away_lost: 9,
conference_won: 21,
conference_lost: 7,
last_five: "4-1",
last_ten: "7-3",
conference: "EAST",
division: "CEN",
playoff_seed: 1,
games_played: 46,
points_scored_per_game: "102.2",
points_allowed_per_game: "96.3",
win_percentage: ".739",
point_differential: 270,
point_differential_per_game: "5.9",
streak_type: "win",
streak_total: 4
},
{
rank: 2,
won: 32,
lost: 15,
streak: "W11",
ordinal_rank: "2nd",
first_name: "Toronto",
last_name: "Raptors",
team_id: "toronto-raptors",
games_back: 2.5,
points_for: 4773,
points_against: 4546,
home_won: 18,
home_lost: 6,
away_won: 14,
away_lost: 9,
conference_won: 23,
conference_lost: 8,
last_five: "5-0",
last_ten: "10-0",
conference: "EAST",
division: "ATL",
playoff_seed: 2,
games_played: 47,
points_scored_per_game: "101.6",
points_allowed_per_game: "96.7",
win_percentage: ".681",
point_differential: 227,
point_differential_per_game: "4.8",
streak_type: "win",
streak_total: 11
},
{
rank: 3,
won: 26,
lost: 19,
streak: "W1",
ordinal_rank: "3rd",
first_name: "Chicago",
last_name: "Bulls",
team_id: "chicago-bulls",
games_back: 7.5,
points_for: 4571,
points_against: 4524,
home_won: 16,
home_lost: 9,
away_won: 10,
away_lost: 10,
conference_won: 16,
conference_lost: 13,
last_five: "2-3",
last_ten: "4-6",
conference: "EAST",
division: "CEN",
playoff_seed: 3,
games_played: 45,
points_scored_per_game: "101.6",
points_allowed_per_game: "100.5",
win_percentage: ".578",
point_differential: 47,
point_differential_per_game: "1.0",
streak_type: "win",
streak_total: 1
},
{
rank: 4,
won: 27,
lost: 21,
streak: "L2",
ordinal_rank: "4th",
first_name: "Atlanta",
last_name: "Hawks",
team_id: "atlanta-hawks",
games_back: 8,
points_for: 4890,
points_against: 4794,
home_won: 15,
home_lost: 8,
away_won: 12,
away_lost: 13,
conference_won: 16,
conference_lost: 12,
last_five: "1-4",
last_ten: "4-6",
conference: "EAST",
division: "SE",
playoff_seed: 4,
games_played: 48,
points_scored_per_game: "101.9",
points_allowed_per_game: "99.9",
win_percentage: ".562",
point_differential: 96,
point_differential_per_game: "2.0",
streak_type: "loss",
streak_total: 2
},
{
rank: 4,
won: 27,
lost: 21,
streak: "W5",
ordinal_rank: "4th",
first_name: "Boston",
last_name: "Celtics",
team_id: "boston-celtics",
games_back: 8,
points_for: 5021,
points_against: 4814,
home_won: 14,
home_lost: 10,
away_won: 13,
away_lost: 11,
conference_won: 20,
conference_lost: 14,
last_five: "5-0",
last_ten: "8-2",
conference: "EAST",
division: "ATL",
playoff_seed: 5,
games_played: 48,
points_scored_per_game: "104.6",
points_allowed_per_game: "100.3",
win_percentage: ".562",
point_differential: 207,
point_differential_per_game: "4.3",
streak_type: "win",
streak_total: 5
},
{
rank: 6,
won: 26,
lost: 21,
streak: "W3",
ordinal_rank: "6th",
first_name: "Miami",
last_name: "Heat",
team_id: "miami-heat",
games_back: 8.5,
points_for: 4498,
points_against: 4500,
home_won: 15,
home_lost: 9,
away_won: 11,
away_lost: 12,
conference_won: 14,
conference_lost: 15,
last_five: "3-2",
last_ten: "4-6",
conference: "EAST",
division: "SE",
playoff_seed: 6,
games_played: 47,
points_scored_per_game: "95.7",
points_allowed_per_game: "95.7",
win_percentage: ".553",
point_differential: -2,
point_differential_per_game: "-0.0",
streak_type: "win",
streak_total: 3
},
{
rank: 7,
won: 25,
lost: 22,
streak: "W2",
ordinal_rank: "7th",
first_name: "Indiana",
last_name: "Pacers",
team_id: "indiana-pacers",
games_back: 9.5,
points_for: 4823,
points_against: 4695,
home_won: 15,
home_lost: 7,
away_won: 10,
away_lost: 15,
conference_won: 16,
conference_lost: 9,
last_five: "2-3",
last_ten: "4-6",
conference: "EAST",
division: "CEN",
playoff_seed: 7,
games_played: 47,
points_scored_per_game: "102.6",
points_allowed_per_game: "99.9",
win_percentage: ".532",
point_differential: 128,
point_differential_per_game: "2.7",
streak_type: "win",
streak_total: 2
},
{
rank: 8,
won: 25,
lost: 23,
streak: "L2",
ordinal_rank: "8th",
first_name: "Detroit",
last_name: "Pistons",
team_id: "detroit-pistons",
games_back: 10,
points_for: 4900,
points_against: 4827,
home_won: 15,
home_lost: 8,
away_won: 10,
away_lost: 15,
conference_won: 14,
conference_lost: 12,
last_five: "2-3",
last_ten: "4-6",
conference: "EAST",
division: "CEN",
playoff_seed: 8,
games_played: 48,
points_scored_per_game: "102.1",
points_allowed_per_game: "100.6",
win_percentage: ".521",
point_differential: 73,
point_differential_per_game: "1.5",
streak_type: "loss",
streak_total: 2
},
{
rank: 9,
won: 23,
lost: 26,
streak: "W1",
ordinal_rank: "9th",
first_name: "New York",
last_name: "Knicks",
team_id: "new-york-knicks",
games_back: 12.5,
points_for: 4875,
points_against: 4945,
home_won: 14,
home_lost: 10,
away_won: 9,
away_lost: 16,
conference_won: 15,
conference_lost: 17,
last_five: "1-4",
last_ten: "4-6",
conference: "EAST",
division: "ATL",
playoff_seed: 9,
games_played: 49,
points_scored_per_game: "99.5",
points_allowed_per_game: "100.9",
win_percentage: ".469",
point_differential: -70,
point_differential_per_game: "-1.4",
streak_type: "win",
streak_total: 1
},
{
rank: 9,
won: 22,
lost: 25,
streak: "L2",
ordinal_rank: "9th",
first_name: "Charlotte",
last_name: "Hornets",
team_id: "charlotte-hornets",
games_back: 12.5,
points_for: 4774,
points_against: 4782,
home_won: 16,
home_lost: 8,
away_won: 6,
away_lost: 17,
conference_won: 13,
conference_lost: 12,
last_five: "3-2",
last_ten: "5-5",
conference: "EAST",
division: "SE",
playoff_seed: 10,
games_played: 47,
points_scored_per_game: "101.6",
points_allowed_per_game: "101.7",
win_percentage: ".468",
point_differential: -8,
point_differential_per_game: "-0.2",
streak_type: "loss",
streak_total: 2
},
{
rank: 9,
won: 21,
lost: 24,
streak: "W1",
ordinal_rank: "9th",
first_name: "Washington",
last_name: "Wizards",
team_id: "washington-wizards",
games_back: 12.5,
points_for: 4605,
points_against: 4717,
home_won: 10,
home_lost: 15,
away_won: 11,
away_lost: 9,
conference_won: 15,
conference_lost: 14,
last_five: "2-3",
last_ten: "5-5",
conference: "EAST",
division: "SE",
playoff_seed: 11,
games_played: 45,
points_scored_per_game: "102.3",
points_allowed_per_game: "104.8",
win_percentage: ".467",
point_differential: -112,
point_differential_per_game: "-2.5",
streak_type: "win",
streak_total: 1
},
{
rank: 12,
won: 20,
lost: 25,
streak: "L8",
ordinal_rank: "12th",
first_name: "Orlando",
last_name: "Magic",
team_id: "orlando-magic",
games_back: 13.5,
points_for: 4443,
points_against: 4496,
home_won: 12,
home_lost: 11,
away_won: 8,
away_lost: 14,
conference_won: 10,
conference_lost: 19,
last_five: "0-5",
last_ten: "1-9",
conference: "EAST",
division: "SE",
playoff_seed: 12,
games_played: 45,
points_scored_per_game: "98.7",
points_allowed_per_game: "99.9",
win_percentage: ".444",
point_differential: -53,
point_differential_per_game: "-1.2",
streak_type: "loss",
streak_total: 8
},
{
rank: 13,
won: 20,
lost: 29,
streak: "L2",
ordinal_rank: "13th",
first_name: "Milwaukee",
last_name: "Bucks",
team_id: "milwaukee-bucks",
games_back: 15.5,
points_for: 4808,
points_against: 5049,
home_won: 13,
home_lost: 8,
away_won: 7,
away_lost: 21,
conference_won: 14,
conference_lost: 16,
last_five: "1-4",
last_ten: "5-5",
conference: "EAST",
division: "CEN",
playoff_seed: 13,
games_played: 49,
points_scored_per_game: "98.1",
points_allowed_per_game: "103.0",
win_percentage: ".408",
point_differential: -241,
point_differential_per_game: "-4.9",
streak_type: "loss",
streak_total: 2
},
{
rank: 14,
won: 12,
lost: 36,
streak: "L3",
ordinal_rank: "14th",
first_name: "Brooklyn",
last_name: "Nets",
team_id: "brooklyn-nets",
games_back: 23,
points_for: 4579,
points_against: 4940,
home_won: 8,
home_lost: 18,
away_won: 4,
away_lost: 18,
conference_won: 8,
conference_lost: 21,
last_five: "1-4",
last_ten: "2-8",
conference: "EAST",
division: "ATL",
playoff_seed: 14,
games_played: 48,
points_scored_per_game: "95.4",
points_allowed_per_game: "102.9",
win_percentage: ".250",
point_differential: -361,
point_differential_per_game: "-7.5",
streak_type: "loss",
streak_total: 3
},
{
rank: 15,
won: 7,
lost: 41,
streak: "L2",
ordinal_rank: "15th",
first_name: "Philadelphia",
last_name: "76ers",
team_id: "philadelphia-76ers",
games_back: 28,
points_for: 4557,
points_against: 5043,
home_won: 4,
home_lost: 18,
away_won: 3,
away_lost: 23,
conference_won: 1,
conference_lost: 27,
last_five: "2-3",
last_ten: "3-7",
conference: "EAST",
division: "ATL",
playoff_seed: 15,
games_played: 48,
points_scored_per_game: "94.9",
points_allowed_per_game: "105.1",
win_percentage: ".146",
point_differential: -486,
point_differential_per_game: "-10.1",
streak_type: "loss",
streak_total: 2
},
{
rank: 1,
won: 43,
lost: 4,
streak: "W6",
ordinal_rank: "1st",
first_name: "Golden State",
last_name: "Warriors",
team_id: "golden-state-warriors",
games_back: 0,
points_for: 5403,
points_against: 4816,
home_won: 22,
home_lost: 0,
away_won: 21,
away_lost: 4,
conference_won: 26,
conference_lost: 2,
last_five: "5-0",
last_ten: "8-2",
conference: "WEST",
division: "PAC",
playoff_seed: 1,
games_played: 47,
points_scored_per_game: "115.0",
points_allowed_per_game: "102.5",
win_percentage: ".915",
point_differential: 587,
point_differential_per_game: "12.5",
streak_type: "win",
streak_total: 6
},
{
rank: 2,
won: 39,
lost: 8,
streak: "L1",
ordinal_rank: "2nd",
first_name: "San Antonio",
last_name: "Spurs",
team_id: "san-antonio-spurs",
games_back: 4,
points_for: 4910,
points_against: 4285,
home_won: 25,
home_lost: 0,
away_won: 14,
away_lost: 8,
conference_won: 22,
conference_lost: 4,
last_five: "3-2",
last_ten: "8-2",
conference: "WEST",
division: "SW",
playoff_seed: 2,
games_played: 47,
points_scored_per_game: "104.5",
points_allowed_per_game: "91.2",
win_percentage: ".830",
point_differential: 625,
point_differential_per_game: "13.3",
streak_type: "loss",
streak_total: 1
},
{
rank: 3,
won: 36,
lost: 13,
streak: "W3",
ordinal_rank: "3rd",
first_name: "Oklahoma City",
last_name: "Thunder",
team_id: "oklahoma-city-thunder",
games_back: 8,
points_for: 5363,
points_against: 4972,
home_won: 22,
home_lost: 5,
away_won: 14,
away_lost: 8,
conference_won: 25,
conference_lost: 4,
last_five: "4-1",
last_ten: "9-1",
conference: "WEST",
division: "NW",
playoff_seed: 3,
games_played: 49,
points_scored_per_game: "109.4",
points_allowed_per_game: "101.5",
win_percentage: ".735",
point_differential: 391,
point_differential_per_game: "8.0",
streak_type: "win",
streak_total: 3
},
{
rank: 4,
won: 31,
lost: 16,
streak: "W3",
ordinal_rank: "4th",
first_name: "Los Angeles",
last_name: "Clippers",
team_id: "los-angeles-clippers",
games_back: 12,
points_for: 4888,
points_against: 4722,
home_won: 16,
home_lost: 7,
away_won: 15,
away_lost: 9,
conference_won: 17,
conference_lost: 11,
last_five: "4-1",
last_ten: "7-3",
conference: "WEST",
division: "PAC",
playoff_seed: 4,
games_played: 47,
points_scored_per_game: "104.0",
points_allowed_per_game: "100.5",
win_percentage: ".660",
point_differential: 166,
point_differential_per_game: "3.5",
streak_type: "win",
streak_total: 3
},
{
rank: 5,
won: 28,
lost: 20,
streak: "W3",
ordinal_rank: "5th",
first_name: "Memphis",
last_name: "Grizzlies",
team_id: "memphis-grizzlies",
games_back: 15.5,
points_for: 4676,
points_against: 4754,
home_won: 19,
home_lost: 7,
away_won: 9,
away_lost: 13,
conference_won: 15,
conference_lost: 13,
last_five: "4-1",
last_ten: "8-2",
conference: "WEST",
division: "SW",
playoff_seed: 5,
games_played: 48,
points_scored_per_game: "97.4",
points_allowed_per_game: "99.0",
win_percentage: ".583",
point_differential: -78,
point_differential_per_game: "-1.6",
streak_type: "win",
streak_total: 3
},
{
rank: 6,
won: 27,
lost: 22,
streak: "W1",
ordinal_rank: "6th",
first_name: "Dallas",
last_name: "Mavericks",
team_id: "dallas-mavericks",
games_back: 17,
points_for: 4943,
points_against: 4962,
home_won: 14,
home_lost: 8,
away_won: 13,
away_lost: 14,
conference_won: 17,
conference_lost: 13,
last_five: "2-3",
last_ten: "5-5",
conference: "WEST",
division: "SW",
playoff_seed: 6,
games_played: 49,
points_scored_per_game: "100.9",
points_allowed_per_game: "101.3",
win_percentage: ".551",
point_differential: -19,
point_differential_per_game: "-0.4",
streak_type: "win",
streak_total: 1
},
{
rank: 7,
won: 25,
lost: 25,
streak: "L3",
ordinal_rank: "7th",
first_name: "Houston",
last_name: "Rockets",
team_id: "houston-rockets",
games_back: 19.5,
points_for: 5257,
points_against: 5331,
home_won: 15,
home_lost: 12,
away_won: 10,
away_lost: 13,
conference_won: 18,
conference_lost: 14,
last_five: "2-3",
last_ten: "4-6",
conference: "WEST",
division: "SW",
playoff_seed: 7,
games_played: 50,
points_scored_per_game: "105.1",
points_allowed_per_game: "106.6",
win_percentage: ".500",
point_differential: -74,
point_differential_per_game: "-1.5",
streak_type: "loss",
streak_total: 3
},
{
rank: 8,
won: 22,
lost: 26,
streak: "W3",
ordinal_rank: "8th",
first_name: "Portland",
last_name: "Trail Blazers",
team_id: "portland-trail-blazers",
games_back: 21.5,
points_for: 4904,
points_against: 4918,
home_won: 13,
home_lost: 10,
away_won: 9,
away_lost: 16,
conference_won: 17,
conference_lost: 15,
last_five: "4-1",
last_ten: "7-3",
conference: "WEST",
division: "NW",
playoff_seed: 8,
games_played: 48,
points_scored_per_game: "102.2",
points_allowed_per_game: "102.5",
win_percentage: ".458",
point_differential: -14,
point_differential_per_game: "-0.3",
streak_type: "win",
streak_total: 3
},
{
rank: 8,
won: 21,
lost: 25,
streak: "W2",
ordinal_rank: "8th",
first_name: "Utah",
last_name: "Jazz",
team_id: "utah-jazz",
games_back: 21.5,
points_for: 4496,
points_against: 4448,
home_won: 14,
home_lost: 10,
away_won: 7,
away_lost: 15,
conference_won: 11,
conference_lost: 17,
last_five: "3-2",
last_ten: "5-5",
conference: "WEST",
division: "NW",
playoff_seed: 9,
games_played: 46,
points_scored_per_game: "97.7",
points_allowed_per_game: "96.7",
win_percentage: ".457",
point_differential: 48,
point_differential_per_game: "1.0",
streak_type: "win",
streak_total: 2
},
{
rank: 10,
won: 20,
lost: 27,
streak: "L4",
ordinal_rank: "10th",
first_name: "Sacramento",
last_name: "Kings",
team_id: "sacramento-kings",
games_back: 23,
points_for: 5009,
points_against: 5085,
home_won: 12,
home_lost: 12,
away_won: 8,
away_lost: 15,
conference_won: 10,
conference_lost: 20,
last_five: "1-4",
last_ten: "5-5",
conference: "WEST",
division: "PAC",
playoff_seed: 10,
games_played: 47,
points_scored_per_game: "106.6",
points_allowed_per_game: "108.2",
win_percentage: ".426",
point_differential: -76,
point_differential_per_game: "-1.6",
streak_type: "loss",
streak_total: 4
},
{
rank: 11,
won: 18,
lost: 28,
streak: "W2",
ordinal_rank: "11th",
first_name: "New Orleans",
last_name: "Pelicans",
team_id: "new-orleans-pelicans",
games_back: 24.5,
points_for: 4729,
points_against: 4832,
home_won: 13,
home_lost: 10,
away_won: 5,
away_lost: 18,
conference_won: 12,
conference_lost: 18,
last_five: "4-1",
last_ten: "7-3",
conference: "WEST",
division: "SW",
playoff_seed: 11,
games_played: 46,
points_scored_per_game: "102.8",
points_allowed_per_game: "105.0",
win_percentage: ".391",
point_differential: -103,
point_differential_per_game: "-2.2",
streak_type: "win",
streak_total: 2
},
{
rank: 12,
won: 18,
lost: 30,
streak: "L1",
ordinal_rank: "12th",
first_name: "Denver",
last_name: "Nuggets",
team_id: "denver-nuggets",
games_back: 25.5,
points_for: 4810,
points_against: 5004,
home_won: 9,
home_lost: 15,
away_won: 9,
away_lost: 15,
conference_won: 11,
conference_lost: 22,
last_five: "2-3",
last_ten: "4-6",
conference: "WEST",
division: "NW",
playoff_seed: 12,
games_played: 48,
points_scored_per_game: "100.2",
points_allowed_per_game: "104.2",
win_percentage: ".375",
point_differential: -194,
point_differential_per_game: "-4.0",
streak_type: "loss",
streak_total: 1
},
{
rank: 13,
won: 14,
lost: 34,
streak: "L3",
ordinal_rank: "13th",
first_name: "Phoenix",
last_name: "Suns",
team_id: "phoenix-suns",
games_back: 29.5,
points_for: 4849,
points_against: 5128,
home_won: 10,
home_lost: 13,
away_won: 4,
away_lost: 21,
conference_won: 9,
conference_lost: 19,
last_five: "1-4",
last_ten: "1-9",
conference: "WEST",
division: "PAC",
playoff_seed: 13,
games_played: 48,
points_scored_per_game: "101.0",
points_allowed_per_game: "106.8",
win_percentage: ".292",
point_differential: -279,
point_differential_per_game: "-5.8",
streak_type: "loss",
streak_total: 3
},
{
rank: 13,
won: 14,
lost: 34,
streak: "L3",
ordinal_rank: "13th",
first_name: "Minnesota",
last_name: "Timberwolves",
team_id: "minnesota-timberwolves",
games_back: 29.5,
points_for: 4777,
points_against: 4970,
home_won: 7,
home_lost: 18,
away_won: 7,
away_lost: 16,
conference_won: 8,
conference_lost: 20,
last_five: "1-4",
last_ten: "2-8",
conference: "WEST",
division: "NW",
playoff_seed: 14,
games_played: 48,
points_scored_per_game: "99.5",
points_allowed_per_game: "103.5",
win_percentage: ".292",
point_differential: -193,
point_differential_per_game: "-4.0",
streak_type: "loss",
streak_total: 3
},
{
rank: 15,
won: 9,
lost: 40,
streak: "L9",
ordinal_rank: "15th",
first_name: "Los Angeles",
last_name: "Lakers",
team_id: "los-angeles-lakers",
games_back: 35,
points_for: 4708,
points_against: 5210,
home_won: 5,
home_lost: 17,
away_won: 4,
away_lost: 23,
conference_won: 3,
conference_lost: 29,
last_five: "0-5",
last_ten: "1-9",
conference: "WEST",
division: "PAC",
playoff_seed: 15,
games_played: 49,
points_scored_per_game: "96.1",
points_allowed_per_game: "106.3",
win_percentage: ".184",
point_differential: -502,
point_differential_per_game: "-10.2",
streak_type: "loss",
streak_total: 9
}
]
}`,
      };
    });

    NbaGameData.ingestSeasonData();
  });

  afterEach(() => {
    HTTP.get.restore();
  });

  describe('Ingest Standings Data', () => {
    it('should ingest standings', () => {
      const league = LeagueFinder.getByName('NBA');
      const season = SeasonFinder.getLatestByLeague(league);
      const leagueTeam = LeagueTeamFinder.getByName(league, 'New York', 'Knicks');

      const seasonLeagueTeam = SeasonLeagueTeams.findOne({
        leagueId: league._id,
        seasonId: season._id,
        leagueTeamId: leagueTeam._id,
      });
      assert.equal(seasonLeagueTeam.wins, 23, 'totalWins');
      assert.equal(seasonLeagueTeam.losses, 26, 'totalLosses');
    });
  });
});
