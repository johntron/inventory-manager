import EventEmitter from 'events';

export default class Model extends EventEmitter {
    constructor(properties) {
        super();

        this._data = properties || {};

        Object.keys(this._data).forEach(key => {
            this.addProperty(key);
        }, this);

        return this;
    }

    addProperty(property) {
        Object.defineProperty(this, property, {
            set: function (value) {
                this._data[property] = value;
                this.emit(property, value);
                this.emit('changed', property, value);
            }
        });
    }
}