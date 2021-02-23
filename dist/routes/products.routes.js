"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _products = _interopRequireDefault(require("../controllers/products.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // GET

router.get('/ByCliente/:id', _products["default"].getProductsByClient);
router.get('/agents', _products["default"].getAgents);
router.post('/', _products["default"].newProduct);
router.all('*', function (req, res) {
  res.status(404).json({
    message: 'La ruta solicitada no existe'
  });
});
var _default = router;
exports["default"] = _default;