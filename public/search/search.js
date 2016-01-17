import _ from "../domify/domify.js";

// var template = '<input type="search">';
var template = System.fetch('./template.html');

export default class Search {
	constructor () {
	}

	render ($el) {
		$el.appendChild(_(template));
	}
}
