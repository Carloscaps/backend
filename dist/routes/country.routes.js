"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _country = _interopRequireDefault(require("../controllers/country.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // GET

router.get('/regions', _country["default"].getRegions);
router.get('/communesByRegion/:id', _country["default"].communesByRegion);
router.all('*', function (req, res) {
  res.status(404).json({
    message: 'La ruta solicitada no existe'
  });
});
var _default = router;
exports["default"] = _default;