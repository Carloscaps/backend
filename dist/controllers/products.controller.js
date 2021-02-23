"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mssql = _interopRequireDefault(require("mssql"));

var _connection = require("../database/connection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var productsFunctions = {};

productsFunctions.getProductsByClient = function (req, res) {
  try {
    var id = req.params.id;

    if (!id) {
      throw error;
    }

    _mssql["default"].connect(_connection.config).then(function (pool) {
      return pool.request().input('cliente', id).query("SELECT P.producto_id, p.nom_extintor \n                            FROM producto p INNER JOIN productoCliente pc ON p.producto_id = pc.producto_id\n                            WHERE pc.cliente_id = @cliente");
    }).then(function (result) {
      var products = result.recordsets;
      return res.status(200).json(products[0]);
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al obtener los productos',
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

productsFunctions.getAgents = function (req, res) {
  try {
    _mssql["default"].connect(_connection.config).then(function (pool) {
      return pool.request().query("SELECT * FROM tipo");
    }).then(function (result) {
      var tipos = result.recordsets;
      return res.status(200).json(tipos[0]);
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al obtener los tipos',
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

productsFunctions.newProduct = function (req, res) {
  try {
    req.body = JSON.parse(req.body.data);
    var _req$body = req.body,
        tipo = _req$body.tipo,
        capacidad = _req$body.capacidad,
        fechaFabricacion = _req$body.fechaFabricacion,
        fechaUltCarga = _req$body.fechaUltCarga,
        fechaUltMantencion = _req$body.fechaUltMantencion;

    _mssql["default"].connect(_connection.config).then(function (pool) {
      return pool.request().input('capacidad', capacidad).input('estado', 'true').input('fechaUltMant', fechaUltMantencion).input('vencMant', fechaUltMantencion) // sumar un año
      .input('vencCarga', fechaUltCarga) // sumar 5 años
      .input('fechaUltCarga', fechaUltCarga).input('fechaFabri', fechaFabricacion).input('tipo', tipo).query("INSERT INTO producto (cap_extagente, estadoProducto, fecha_utlMant, venc_mant, fecha_ultcarga, fecha_vencarga, fecha_fabricacion, tipo_id)\n                        VALUES (@capacidad, @estado, @fechaUltMant, @vencMant, @fechaUltCarga, @vencCarga, @fechaFabri, @tipo)");
    }).then(function () {
      return res.status(201).json({
        msg: 'Producto registrado exitosamente'
      });
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al registrar el nuevo producto',
        error: error
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor',
      error: error
    });
  }
};

var _default = productsFunctions;
exports["default"] = _default;