import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'Wins League';
Accounts.emailTemplates.from = 'Wins League <team@winsleague.com>';

Accounts.emailTemplates.enrollAccount.subject = (user) =>
  'Welcome to Wins League';

Accounts.emailTemplates.enrollAccount.text = (user, url) =>
  `Wins League is a simple form fantasy sports, but just as much fun.
  
To activate your account, simply click the link below:
 
${url}`;
