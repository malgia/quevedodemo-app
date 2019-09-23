const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/', routes);

app.use(express.static('public'));

// require('./utils/stream')();

require('./utils/websocket')();

module.exports = app;
