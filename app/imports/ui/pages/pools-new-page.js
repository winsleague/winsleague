import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import log from '../../startup/log';

import './pools-new-page.html';

import { Leagues } from '../../api/leagues/leagues';

Template.Pools_new_page.helpers({
  leagueOptions: () => Leagues.find().map(league => {
    return { label: league.name, value: league._id };
  }),

  nflLeagueId: () => Template.instance().getNflLeagueId(),
});

Template.Pools_new_page.onCreated(function () {
  this.getNflLeagueId = () => {
    const league = Leagues.findOne({ name: 'NFL' }, { fields: { _id: 1 } });
    if (league) return league._id;
    return null;
  };

  this.autorun(() => {
    this.subscribe('leagues.list', () => {
      const leagues = Leagues.find().map(league => league._id);
      log.debug(`leagues.list subscription ready: ${Leagues.find().count()} leagues, %j`, leagues);

      this.subscribe('seasons.latest');
    });
  });
});


AutoForm.hooks({
  insertPoolForm: {
    onSuccess: (formType, poolId) => {
      FlowRouter.go('Pools.show', { poolId });
    },
  },
});

