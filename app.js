const http = require('http');

const path = require('path');

const fs = require('fs');

const express = require('express');

const app = express();

const webpack = require('webpack');

const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackDevConfig = require('./webpack.config.js');

const engines = require('consolidate');

const router = require('./server/router/router.js');

app.use(router);

app.set('views', path.join(__dirname, '/'));

app.engine('html', engines.mustache);

app.set('view engine', 'html');

app.use('/', express.static(__dirname + '/'));

// let dll = webpack(webpackDllConfig);

let compiler = webpack(webpackDevConfig);

app.use(webpackDevMiddleware(compiler, {
  // publicPath与webpack.config.js保持一致
  publicPath: webpackDevConfig.output.publicPath,
  noInfo: true,
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));

let reload = require('reload');

const server = http.createServer(app);

reload(server, app);

server.listen(8088, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('process succeed');
	}
});

// const server = http.createServer(app).listen(8088, (err) => {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		const host = server.address().address;
// 		const port = server.address().port;
// 		console.log(`Server listening on ${host}:${port}`);
// 	}
// });