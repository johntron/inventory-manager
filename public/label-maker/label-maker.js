import './label-maker.scss!';
import template from './label-maker.html!';
import domify from 'domify/domify.js';
import _ from 'lodash';
import removeChildren from 'remove-children/remove-children.js';

const BARCODE_OBJECT_NAME = 'BARCODE';

export default class LabelMaker {
    constructor(printer) {
        this.printer = printer;
        this.printers = [];
        this.$el;
        this.events = [];
    }

    get $() {
        return this.$el.querySelector.bind(this.$el);
    }

    set printers(printers) {
        this._printers = printers;
    }

    get printer_name() {
        return this.$el.querySelector('select').value;
    }

    set label(label) {
        this._label = label;
    }

    get text() {
        return this.$el.querySelector('textarea').value;
    }

    render () {
        this.$el = domify(template);

        var $printers = this.$('select');
        var $text = this.$('textarea');
        var $print = this.$('.print');
        var preview = _.debounce(this.preview.bind(this), 250);

        this._printers.forEach(printer => {
            var $printer = document.createElement('option');
            $printer.textContent = printer.name;
            $printer.value = printer.name;
            $printers.appendChild($printer);
        });

        this.events['preview (keyup)'] = $text.addEventListener('keyup', preview);
        this.events['preview (change)'] = $text.addEventListener('change', preview);
        this.events['print'] = $print.addEventListener('click', this.print.bind(this));

        return this.$el;
    }

    hide() {
        this.$el.classList.add('hidden');
    }

    show() {
        this.$el.classList.remove('hidden');
    }

    preview() {
        var $preview = this.$('.preview');
        var $count = this.$('.count');

        $count.textContent = this.text.length;
        removeChildren($preview);
        
        if (this.text === '') {
            return; // Short-circuit
        }

        this.printer.preview(this._label, this.text, this.printer_name).then(src => {
            var $img = document.createElement('img');

            $img.src = `data:image/png;base64,${src}`;
            $preview.appendChild($img);
        });
    }

    print() {
        this.printer.print(this._label, this.text, this.printer_name);
    }
};