import './global.css!';
import PrinterService from './printer-service/printer-service.js';
import LabelMaker from './label-maker/label-maker.js';
import {View as SettingsView, Model as SettingsModel} from './settings/settings.js';
import LocalStorage from 'storage/local-storage.js';
import SessionStorage from 'storage/session-storage.js';
import driver_source from './DYMO.Label.Framework.2.0.2.js!text';

export default class App {
    constructor(env) {
        this.env = env || {};
        this.service.check_environment();
        this.label_maker.show();
        this.label_maker.preview();
    }

    get baseURL() {
        return System.baseURL;
    }

    get service() {
        this.storage.persistent['ServicePort'] = window.location.port;
        var source = driver_source.replace(/https:\/\/localhost/g, `${location.protocol}//${location.hostname}`);
        var script = document.createElement('script');
        script.textContent = source;
        document.body.appendChild(script);
        this._service = this._service || new PrinterService(dymo.label.framework);
        return this._service;
    }

    get label_maker() {
        if (this._label_maker) {
            return this._label_maker;
        }

        this._label_maker = new LabelMaker(this.service);
        var label = this.service.load_label(this.baseURL + 'label.label');
        var $view;

        this.label_maker.printers = this.service.driver.getPrinters();
        this.label_maker.label = label;
        $view = this.label_maker.render();
        this.label_maker.hide();
        document.body.appendChild($view);

        return this._label_maker;
    }

    get settings() {
        if (this._settings) {
            return this._settings;
        }

        this._settings = new SettingsView();
        this._settings.host_address = this.settings_model.host_address;
        this._settings.render();
        document.body.appendChild($view);

        return this._settings;
    }

    get settings_model() {
        if (this._settings_model) {
            return this._settings_model;
        }

        var data = this.storage.persistent['settings'];
        data = data ? JSON.parse(data) : SettingsModel.defaults;
        this._settings_model = new SettingsModel(data);
        this._settings_model.on('changed', (key, value) => {
            console.log(`Model's ${key} changed to ${value}`);
        });

        return this._settings_model;
    }

    get storage() {
        if (this._storage) {
            return this._storage;
        }

        this._storage = {
            persistent: localStorage,
            session: sessionStorage
        };

        return this._storage;
    }
}
