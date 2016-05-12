Function.prototype.extend = function extend(subclass) {
	var extended,
		superclass = this;
	if (typeof subclass !== 'function') {
		console.error('Expecting class object.');
		return false;
	}
	if (subclass === superclass) {
		console.error('Superclass and subclass is the same class.');
		return false;
	}
	eval('extended = function' + (subclass.name ? ' ' + subclass.name : '') + '() {' +
		'superclass.apply(this, arguments);' +
		'subclass.apply(this, arguments);' +
		'}');
	extended.prototype = $.extend({}, superclass.prototype, subclass.prototype);
	extended._parents = subclass._parents.concat(subclass._parents.indexOf(superclass) < 0 ? [superclass]: []);
	superclass._children = superclass._parents.concat(superclass._parents.indexOf(subclass) < 0 ? [subclass]: []);
	return extended;
}
Function.prototype.inherit = function inheritFrom(superclass) {
	return superclass.extend(this);
}
Function.prototype._subclass = Function.prototype.extend;
Function.prototype._superclass = Function.prototype.inherit;
Function.prototype._parents = [];
Function.prototype._children = [];
