describe('Season League Teams', () => {
  describe('Update Team Stats', () => {
    it('should add up the wins and losses for all completed games', () => {
      const league = Modules.leagues.getByName('NFL');
      const season = Modules.seasons.getByYear(league, 2015);

      const homeLeagueTeam = LeagueTeams.findOne({ abbreviation: 'NYG' });
      const awayLeagueTeam = LeagueTeams.findOne({ abbreviation: 'SEA' });

      Games.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        gameId: '1',
        gameDate: new Date(),
        homeTeamId: homeLeagueTeam._id,
        homeScore: 17,
        awayTeamId: awayLeagueTeam._id,
        awayScore: 10,
        status: 'completed',
        period: 'final',
      });

      Modules.server.seasonLeagueTeams.updateTeamStats(
        season.leagueId,
        season._id,
        homeLeagueTeam._id
      );

      const homeSeasonLeagueTeam = SeasonLeagueTeams.findOne({
        leagueId: season.leagueId,
        seasonId: season._id,
        leagueTeamId: homeLeagueTeam._id,
      });
      expect(homeSeasonLeagueTeam.wins).toBe(1, 'wins');
      expect(homeSeasonLeagueTeam.losses).toBe(0, 'losses');
    });
  });
});
