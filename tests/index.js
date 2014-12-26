var util = require('util');
var fs = require('fs');
var extend = require('xtend');

var serialize = require('../source/serialize');
var render = require('../')();

var url = function(path) {
	var loc = window.location;
	return util.format('%s//%s/tests/assets/%s', loc.protocol, loc.host, path);
};

var assets = {};
assets[url('simple-block.html')] = fs.readFileSync(__dirname + '/assets/simple-block.html', 'utf-8');
assets[url('nested-block.html')] = fs.readFileSync(__dirname + '/assets/nested-block.html', 'utf-8');
assets[url('stack-block.html')] = fs.readFileSync(__dirname + '/assets/stack-block.html', 'utf-8');
assets[url('simple-inline.html')] = fs.readFileSync(__dirname + '/assets/simple-inline.html', 'utf-8');
assets[url('nested-inline.html')] = fs.readFileSync(__dirname + '/assets/nested-inline.html', 'utf-8');
assets[url('column-inline.html')] = fs.readFileSync(__dirname + '/assets/column-inline.html', 'utf-8');
assets[url('white-space.html')] = [fs.readFileSync(__dirname + '/assets/white-space.html', 'utf-8'), 512, 768];
assets[url('multiline.html')] = fs.readFileSync(__dirname + '/assets/multiline.html', 'utf-8');
assets[url('br.html')] = fs.readFileSync(__dirname + '/assets/br.html', 'utf-8');
assets[url('block-in-inline.html')] = fs.readFileSync(__dirname + '/assets/block-in-inline.html', 'utf-8');
assets[url('nested-block-in-inline.html')] = fs.readFileSync(__dirname + '/assets/nested-block-in-inline.html', 'utf-8');
assets[url('padded-inline.html')] = fs.readFileSync(__dirname + '/assets/padded-inline.html', 'utf-8');

var canvas = function(element, options) {
	var canvas = document.createElement('canvas');
	var dimensions = options.viewport.dimensions;

	canvas.width = dimensions.width;
	canvas.height = dimensions.height;

	element.appendChild(canvas);
	options.context = canvas.getContext('2d');

	render.write(options);
};

var iframe = function(element, options) {
	var dimensions = options.viewport.dimensions;
	var iframe = document.createElement('iframe');
	element.appendChild(iframe);

	iframe.width = dimensions.width;
	iframe.height = dimensions.height;

	var doc = iframe.contentDocument;

	doc.open();
	doc.write(options.content);
	doc.close();
};

var row = function(element, options) {
	var row = document.createElement('div');
	row.className = 'row clearfix';

	var left = document.createElement('div');
	left.className = 'left-column';

	var right = document.createElement('div');
	right.className = 'right-column';

	row.appendChild(left);
	row.appendChild(right);

	element.appendChild(row);

	canvas(left, options);
	iframe(right, options);
};

var container = document.getElementById('container');

Object.keys(assets).forEach(function(url) {
	var data = assets[url];
	data = Array.isArray(data) ? data : [data, 512, 256];

	row(container, {
		url: url,
		content: data[0],
		viewport: {
			position: { x: 0, y: 0 },
			dimensions: { width: data[1], height: data[2] }
		}
	});
});

render.on('data', function(page) {
	console.log(serialize(page.layout));
});

render.end();
