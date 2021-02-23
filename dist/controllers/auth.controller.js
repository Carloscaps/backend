"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mssql = _interopRequireDefault(require("mssql"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _crypto = _interopRequireDefault(require("crypto"));

var _connection = require("../database/connection");

var _config = require("../config.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authFunctions = {};

var signToken = function signToken(email) {
  return _jsonwebtoken["default"].sign({
    email: email
  }, _config.secret, {
    expiresIn: 60 * 60 * 24 // 24 hrs

  });
};

authFunctions.login = function (req, res) {
  try {
    req.body = JSON.parse(req.body.data);
    var _req$body = req.body,
        rut = _req$body.rut,
        password = _req$body.password;

    _mssql["default"].connect(_connection.config).then(function (pool) {
      return pool.request().input('id', rut).query('SELECT * FROM cliente WHERE rut_cliente = @id');
    }).then(function (result) {
      var recordset = result.recordset;
      var cliente = recordset[0];

      _crypto["default"].pbkdf2(password, cliente.password_salt, 1000, 64, 'sha1', function (err, key) {
        var encryptPassword = key.toString('base64');

        if (cliente.password_hash === encryptPassword) {
          var token = signToken(cliente.email_cliente);
          return res.status(200).json({
            token: token,
            user: cliente,
            msg: 'Exito al ingresar'
          });
        }

        return res.status(400).json({
          msg: 'usuario y/o constraseña incorrecta',
          error: err
        });
      });
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al iniciar sesion',
        error: error
      });
    });
  } catch (error) {
    return res.status(500).json({
      msg: 'error en el servidor',
      error: error
    });
  }
};

var _default = authFunctions;
exports["default"] = _default;