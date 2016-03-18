#!/usr/bin/env node

var fruitSalad = require('./');
var path = require('path');
var fruitPath = path.resolve(process.argv[2]);

fruitSalad(fruitPath).then(
	console.log,
	e => console.error(e.stack || e.toString())
);
