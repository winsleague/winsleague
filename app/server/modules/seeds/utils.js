Modules.server.seeds.utils = {
  initializeLeagues() {
    log.info(`Initializing leagues and teams`);

    if (!Modules.leagues.getByName('NFL')) Modules.server.seeds.nfl.create();
    if (!Modules.leagues.getByName('NBA')) Modules.server.seeds.nba.create();
    if (!Modules.leagues.getByName('MLB')) Modules.server.seeds.mlb.create();
  },

  removeLeague(leagueName) {
    const league = Modules.leagues.getByName(leagueName);
    if (!league) return;
    const leagueId = league._id;
    Games.remove({ leagueId });
    LeagueTeams.remove({ leagueId });
    PoolTeams.remove({ leagueId });
    Pools.remove({ leagueId });
    SeasonLeagueTeams.remove({ leagueId });
    Seasons.remove({ leagueId });
    Leagues.remove({ _id: leagueId });
  },
};
