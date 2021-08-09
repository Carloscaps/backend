"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var config = {
  user: 'dbwilug',
  password: '',
  server: 'wcorpd.wilug.cl',
  database: 'WilugCorpD',
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    encrypt: false // instancename: 'SQLEXPRESS'

  },
  port: 1433
};
exports.config = config;