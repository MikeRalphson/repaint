var util = require('util');
var ParentBox = require('./parent-box');

var InlineBox = function(parent, style) {
	ParentBox.call(this, parent, style);
};

util.inherits(InlineBox, ParentBox);

// InlineBox.prototype.attach = function(node, style) {
// 	var box = Box.prototype.attach.call(this, style);
// 	return box;
// };

InlineBox.prototype.layout = function(offset) {
	this._layoutWidth();
	this._layoutPosition(offset);
	this._layoutChildren();
	this._layoutHeight();
};

// InlineBox.prototype.draw = function(context) {

// };

InlineBox.prototype._layoutWidth = function() {
	// var marginLeft = this.style['margin-left'];
	// var marginRight = this.style['margin-right'];

	// var borderLeft = this.styledBorderWidth('left');
	// var borderRight = this.styledBorderWidth('right');

	// var paddingLeft = this.style['padding-left'];
	// var paddingRight = this.style['padding-right'];

	var style = this.style;

	this.margin.left = this.toPx(style['margin-left']);
	this.margin.right = this.toPx(style['margin-right']);

	this.border.left = this.toPx(this.styledBorderWidth('left'));
	this.border.right = this.toPx(this.styledBorderWidth('right'));

	this.padding.left = this.toPx(style['padding-left']);
	this.padding.right = this.toPx(style['padding-right']);
};

InlineBox.prototype._layoutPosition = function(offset) {
	var parent = this.parent;
	var style = this.style;

	this.border.top = this.toPx(this.styledBorderWidth('top'));
	this.border.bottom = this.toPx(this.styledBorderWidth('bottom'));

	this.padding.top = this.toPx(style['padding-top']);
	this.padding.bottom = this.toPx(style['padding-bottom']);

	this.position.x = parent.position.x + offset.width + this.leftWidth(); //parent.position.x + parent.dimensions.width +  this.leftWidth();
	this.position.y = parent.position.y + this.topWidth();
};

InlineBox.prototype._layoutChildren = function() {
	var self = this;
	var offset = { width: 0, height: 0 };

	this.children.forEach(function(child) {
		child.layout(offset);

		self.dimensions.height = Math.max(self.dimensions.height, child.height());
		offset.width += child.width();
		// self.dimensions.width += child.width();
	});

	this.dimensions.width = offset.width;
};

InlineBox.prototype._layoutHeight = function() {
	this.dimensions.height = this.toPx(this.style['font-size']);
};

module.exports = InlineBox;
