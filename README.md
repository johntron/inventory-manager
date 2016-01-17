# Inventory manager

[![Proof-of-concept](https://dl.dropboxusercontent.com/u/3428571/Inventory%20management.png)](https://vimeo.com/152091761)

This project helps manage inventory like so:

1. Connect a [DYMO label maker](http://bit.ly/1RXCdfu) and launch this service.
2. Open the service in your browser and enter enter details (datasheets, URLs, etc.) for an item.
3. Print the [PDF 417](https://en.wikipedia.org/wiki/PDF417) label and stick it on your inventory.
4. Repeat for all your inventory.

Then, just scan any label with your smartphone to get the deets - most barcode reader apps will work.


# Running

Connect your label maker, install [DYMO Label](http://developers.dymo.com/category/dymo-label-framework/) ("DLS" only - "Label Framework" is included in this project), then run:

```shell
npm install
node server.js
```


# How it works

The `server.js` script will server web requests for data under `public/`. The [index](public/index.html) uses [jspm](http://jspm.io/) to transpile ES6 to ES5. This JavaScript application uses the [DYMO framework](http://developers.dymo.com/category/dymo-label-framework/) to communicate with a label maker connected to the machine running `server.js` (with caveats - see Known issues). The framework communicates by issuing HTTP requests to a (binary) service managed by `launchd` (or Services on Windows I guess). This webservice uses DYMO's proprietary API to communicate with the label maker device.

When the server starts, these things happen:

* Portscan for the DYMO web service (see Known issues)
* Start [`http-server`](https://github.com/indexzero/http-server) and immediately start serving web requests - this service proxies requests to the DYMO web service
* Install browser dependencies by running `jspm.install()`


# Progress

1. Proof of concept - Run `app.label_maker.show()` in browser console (done) 
2. Remote usage - e.g. Use your smartphone (done, but hacky - see Known issues #1, 2, and 3) 
3. Inventory UI - Inventory IDs and other information, label/URL association, errata CRUD
4. Cloud storage integration - use Dropbox API to store inventory index and errata
5. Dynamic address - change the service's address without reprinting all your labels (for free)


# Known issues

1. DYMO service binds to "localhost" only, but we want to use this service remotely, so I have to changing the protocol, scheme, and port used by the DYMO JS library on the fly (see `get service()` in app.js).
2. To acheive #1, had to portscan for service, and `evilscan` was busted, so we're not following mainline branch for this npm package (see [https://github.com/eviltik/evilscan/pull/38](https://github.com/eviltik/evilscan/pull/38)).
3. To achieve #1, had to patch `http-server` npm package (see [https://github.com/indexzero/http-server/pull/236](https://github.com/indexzero/http-server/pull/236)) - TLS cert couldn't be verified, so add ability to proxy insecurely.
4. DYMO service crashes when (restart with `supervisorctl` or [LaunchControl](http://www.soma-zone.com/LaunchControl/)):
	* Trying to create a label with empty object text (e.g. `.setObjectText(BARCODE_OBJECT_NAME, '');`)
	* Trying to create a label undefined printer name (e.g. `.renderLabel(xml, params, undefined);`)
	* Trying to print QR code in size that's too big for tape (e.g. "Medium" on 1/2" tape)
5. Changes to the DYMO service may break this project, because we're pinned to the framework version in this repo (no repo available through npm or jspm).
6. UI takes a long time to load, because assets are not load-optimized - do this manually by running `jspm bundle app.js` and uncomment the line in [index.html](public/index.html).

# Reference material

* DYMO JavaScript API documentation is in `DYMO Label Framework/doc/JavaScript` of the [Dymo Label SDK](http://www.dymo.com/en-US/online-support-sdk) Installer
* [Dropbox API](https://www.dropbox.com/developers)
* [dropbox.js](https://github.com/dropbox/dropbox-js)
* [Irrelevant but funny](https://tools.ietf.org/html/rfc1149)
