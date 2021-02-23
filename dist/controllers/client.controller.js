"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mssql = _interopRequireDefault(require("mssql"));

var _crypto = _interopRequireDefault(require("crypto"));

var _connection = require("../database/connection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var clientFunctions = {};

clientFunctions.getClients = function (req, res) {
  try {
    _mssql["default"].connect(_connection.config).then(function (pool) {
      return pool.request().query('SELECT * FROM cliente');
    }).then(function (result) {
      var clientes = result.recordsets;
      return res.status(200).json(clientes[0]);
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al obtener los clientes',
        error: error
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor',
      error: error
    });
  }

  ;
};

clientFunctions.insertCliente = function (req, res) {
  try {
    req.body = JSON.parse(req.body.data);
    var _req$body = req.body,
        nombre = _req$body.nombre,
        razonSocial = _req$body.razonSocial,
        nombreContacto = _req$body.nombreContacto,
        rut = _req$body.rut,
        direccion = _req$body.direccion,
        direccionFactura = _req$body.direccionFactura,
        giro = _req$body.giro,
        ciudad = _req$body.ciudad,
        telefono = _req$body.telefono,
        secondTelefono = _req$body.secondTelefono,
        email = _req$body.email,
        tipo = _req$body.tipo,
        password = _req$body.password,
        comuna = _req$body.comuna;

    _mssql["default"].connect(_connection.config).then(function (pool) {
      _crypto["default"].randomBytes(16, function (err, salt) {
        if (err) {
          throw new Error('Error al encryptar la contraseña');
        }

        var newSalt = salt.toString('base64');

        _crypto["default"].pbkdf2(password, newSalt, 1000, 64, 'sha1', function (err, key) {
          var encryptPassword = key.toString('base64');
          return pool.request().input('rut', rut).input('nombre', nombre).input('razon', razonSocial).input('direccion', direccion).input('ciudad', ciudad).input('telefono', telefono).input('email', email).input('tipo', tipo).input('password', encryptPassword).input('salt', newSalt).input('contacto', nombreContacto).input('factura', direccionFactura).input('giro', giro).input('telefonoDos', secondTelefono).input('comuna', comuna).query("INSERT INTO cliente \n                            (rsocial_cliente,nombre_cliente, nombre_contacto, rut_cliente, password_hash, password_salt, direccion_trabajo, direccion_factura, giro, ciudad, telefono, telefono_dos, email_cliente, tipo_cliente, comuna_id)\n                            VALUES (@nombre, @razon, @contacto, @rut, @password, @salt, @direccion, @factura, @giro, @ciudad, @telefono, @telefonoDos, @email, @tipo, @comuna)");
        });
      });
    }).then(function () {
      return res.status(201).json({
        msg: 'Cliente registrado exitosamente'
      });
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al registrar un nuevo cliente',
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

var _default = clientFunctions;
exports["default"] = _default;