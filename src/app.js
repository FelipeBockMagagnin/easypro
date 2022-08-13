const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json({limit: '50mb'})) 
const router = express.Router();
//Rotas
const index = require('./routes/index');
const relatorioRoute = require('./routes/relatorioRoute');
app.use('/', index);
app.use('/relatorio', relatorioRoute);
module.exports = app;