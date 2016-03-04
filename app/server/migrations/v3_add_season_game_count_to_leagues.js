Migrations.add({
  version: 3,
  name: 'Adds number of games in a season to Leagues collection',
  up: () => {
    const nflLeague = Modules.leagues.getByName('NFL');
    if (! nflLeague) throw new Error('NFL league not found!');
    Leagues.update(nflLeague._id,
      {
        $set: {
          seasonGameCount: 16,
        },
      }
    );

    const nbaLeague = Modules.leagues.getByName('NBA');
    if (! nbaLeague) throw new Error('NBA league not found!');
    Leagues.update(nbaLeague._id,
      {
        $set: {
          seasonGameCount: 82,
        },
      }
    );

    const mlbLeague = Modules.leagues.getByName('MLB');
    if (! mlbLeague) throw new Error('MLB league not found!');
    Leagues.update(mlbLeague._id,
      {
        $set: {
          seasonGameCount: 162,
        },
      }
    );
  },
  down: () => {
    Leagues.update({}, { $unset: { seasonGameCount: '' } }, { multi: true });
  },
});
