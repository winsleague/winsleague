import { Accounts } from 'meteor/useraccounts:core';

Accounts.emailTemplates.siteName = 'League Wins Pool';
Accounts.emailTemplates.from = 'League Wins Pool <team@leaguewinspool.com>';
Accounts.emailTemplates.enrollAccount.subject = function (user) {
  return 'Welcome to League Wins Pool, ' + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  return 'You have registered for League Wins Pool!'
    + ' To activate your account, simply click the link below:\n\n'
    + url;
};

