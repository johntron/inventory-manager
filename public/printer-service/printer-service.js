import 'fetch';

const BARCODE_OBJECT_NAME = 'BARCODE';

export default class Service {
    constructor(driver) {
        this.driver = driver;
    }

    check_environment() {
//         var env = this.driver.checkEnvironment();

//         if (!env.isBrowserSupported) {
//             alert(`Unsupported browser`);
//             return false;
//         }

//         if (!env.isFrameworkInstalled) {
//             alert(`Framework not installed - install web service or DYMO Label application`);
//             return false;
//         }

//         if (env.errorDetails) {
//             alert(env.errorDetails);
//             return false;
//         }

        return true;
    }

    load_label(str) {
        return fetch(str).then(str => str.text()).then(str => {
            return this.driver.openLabelXml(str);
        });
    }

    get params() {
        return this.driver.createLabelRenderParamsXml({
                shadowDepth: 0,
                pngUseDisplayResolution: false
        });
    }

    preview(label, text, printer) {
        return label.then(label => {
            label.setObjectText(BARCODE_OBJECT_NAME, text);
            var xml = label.getLabelXml();
            return this.driver.renderLabel(xml, this.params, printer);
        });
    }

    print(label, text, printer) {
        return label.then(label => {
            label.setObjectText(BARCODE_OBJECT_NAME, text);
            var xml = label.getLabelXml();
            return this.driver.printLabel(printer, this.params, xml);
        });
    }
}