import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'Wins League';
Accounts.emailTemplates.from = 'Wins League <team@winsleague.com>';

Accounts.emailTemplates.enrollAccount.subject = (user) =>
  `Welcome to Wins League, ${user.profile.name}`;

Accounts.emailTemplates.enrollAccount.text = (user, url) =>
  `You have registered for Wins League!
To activate your account, simply click the link below:
 
${url}`;
