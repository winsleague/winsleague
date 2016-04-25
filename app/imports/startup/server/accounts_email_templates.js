import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'League Wins Pool';
Accounts.emailTemplates.from = 'League Wins Pool <team@leaguewinspool.com>';

Accounts.emailTemplates.enrollAccount.subject = (user) =>
  `Welcome to League Wins Pool, ${user.profile.name}`;

Accounts.emailTemplates.enrollAccount.text = (user, url) =>
  `You have registered for League Wins Pool!
To activate your account, simply click the link below:
 
${url}`;
