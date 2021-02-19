"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var config = {
  user: 'dbtest',
  password: 'Wilug21#',
  server: 'wcorpd.wilug.cl',
  database: 'WilugCorpD_Test',
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    encrypt: false // instancename: 'SQLEXPRESS'

  },
  port: 1433
};
exports.config = config;