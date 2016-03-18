var deburr = require('lodash.deburr');
var paramCase = require('param-case');
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var fs = require('fs-promise');
var path = require('path');

var fruitPage = 'https://en.wikipedia.org/wiki/List_of_culinary_fruits';

var toModuleName = fruit => paramCase(deburr(fruit));
var getFruitNames = text => {
	var $ = cheerio.load(text);
	return $('.columns')
		.slice(0, 24)
		.find('ul li > a:first-of-type')
		.map((i, el) => toModuleName($(el).text()))
		.toArray();
};

var loadFruit = () => fetch(fruitPage).then(res => res.text());

var fruitDoesntExist = (fruit, fruitPath) => fs.exists(path.resolve(fruitPath, `${fruit}.js`)).then(exists => !exists);

var promiseFilter = (xs, f) => xs.reduce(
	(ysPromise, x) => ysPromise
		.then(ys => f(x)
					.then(xx => xx ? ys.concat([x]) : ys)),
	Promise.resolve([])
);

var randomElement = xs => xs[Math.floor(xs.length * Math.random())];

var deAmerican = fruit => fruit.filter(f => !/^american/.test(f));

var log = a => (console.log(a), a);

module.exports = fruitPath => loadFruit()
	.then(getFruitNames)
	.then(deAmerican)
	.then(fruit => promiseFilter(fruit, f => fruitDoesntExist(f, fruitPath)))
	.then(randomElement);
