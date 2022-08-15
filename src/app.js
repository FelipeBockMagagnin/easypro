const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false, limit: '100mb' }))
app.use(bodyParser.json({limit: '100mb'})) 
const router = express.Router();
//Rotas
const index = require('./routes/index');
const relatorioRoute = require('./routes/relatorioRoute');
const projectRoute = require('./routes/projectRoute');
app.use('/', index);
app.use('/relatorio', relatorioRoute);
app.use('/project', projectRoute);
module.exports = app;