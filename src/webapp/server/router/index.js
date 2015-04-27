"use strict";

/**
 * The Index of Routes
 */

module.exports = function (app) {
  app.use('/users', require('./routes/users'));
}
