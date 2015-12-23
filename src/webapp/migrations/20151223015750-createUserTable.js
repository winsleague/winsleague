'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('user', {
    id: { type: 'int', primaryKey: true },
    username: { type: 'string', unique: true},
    email: 'string',
    password: 'string',
    firstName: 'string',
    lastName: 'string'
  });
  return null;
};

exports.down = function(db) {
  db.dropTable('user');
  return null;
};
