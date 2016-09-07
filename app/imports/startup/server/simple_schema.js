/* From https://github.com/aldeed/meteor-simple-schema#debug-mode
 Set SimpleSchema.debug = true in your app before creating any named validation contexts
  to cause all named validation contexts to automatically log all invalid key errors to
  the browser console. This can be helpful while developing an app to figure out why
  certain actions are failing validation.
 */

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

SimpleSchema.debug = false;
