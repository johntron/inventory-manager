import template from './settings.html!';
import domify from 'domify/domify.js';

export default class View {
    constructor() {

    }

    set model(model) {
        this._model = model;
        return this._model;
    }

    render() {
        this.$el = domify(template);

        return this.$el;
    }
}