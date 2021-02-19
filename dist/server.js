"use strict";

var _express = _interopRequireDefault(require("express"));

var _methodOverride = _interopRequireDefault(require("method-override"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _client = _interopRequireDefault(require("./routes/client.routes"));

var _auth = _interopRequireDefault(require("./routes/auth.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); // port configuration

app.set('PORT', process.env.PORT || 4000); // middleware configuration

app.use((0, _methodOverride["default"])());
app.use((0, _cors["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // routes

app.use('/api/clients', _client["default"]);
app.use('/api/auth', _auth["default"]);
app.get('/', function (req, res) {
  res.send('Backend Wilug');
}); // app execute

app.listen(app.get('PORT'), function () {
  console.log("server on port ".concat(app.get('PORT')));
});