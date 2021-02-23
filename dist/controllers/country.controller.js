"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mssql = _interopRequireDefault(require("mssql"));

var _connection = require("../database/connection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var countryFunctions = {};

countryFunctions.getRegions = function (req, res) {
  try {
    _mssql["default"].connect(_connection.config).then(function (pool) {
      return pool.request().query('SELECT * FROM region');
    }).then(function (result) {
      var regions = result.recordsets;
      return res.status(200).json(regions[0]);
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al obtener las regiones',
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

countryFunctions.communesByRegion = function (req, res) {
  try {
    var id = req.params.id;

    if (!id) {
      throw error;
    }

    _mssql["default"].connect(_connection.config).then(function (pool) {
      return pool.request().input('region', id).query("SELECT c.comuna_id, c.nombre_comuna \n                            FROM comuna c\n                            WHERE c.region_id = @region");
    }).then(function (result) {
      var communes = result.recordsets;
      return res.status(200).json(communes[0]);
    })["catch"](function (error) {
      return res.status(400).json({
        msg: 'error al obtener las comunas',
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

var _default = countryFunctions;
exports["default"] = _default;