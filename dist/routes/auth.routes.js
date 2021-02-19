"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("../controllers/auth.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
router.post('/login', _auth["default"].login);
router.all('*', function (req, res) {
  res.status(404).json({
    message: 'La ruta solicitada no existe'
  });
});
var _default = router;
exports["default"] = _default;