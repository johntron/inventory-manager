var create_server = require('http-server').createServer;
var path = require('path');
var jspm = require('jspm');
var evilscan = require('evilscan');
var opts = {};

boot()
.then(() => {
	console.log(`Portscanning for label service (${opts.service_ports}) ...`);
    return scan();
})
.then(port => {
	opts.label_service_port = port;
	console.log(`... found service at http://127.0.0.1:${port}/`);
	console.log('Starting webserver...');
    return serve();
})
.then(address => {
	console.log(`Serving ./public on http://${address}/`);
	console.log('Installing browser packages ...');
})
.then(() => jspm.dlLoader())
.then(() => jspm.install(true))
.then(() => console.log('... done'))
.catch(err => {
	console.error(err);
	process.exit();
});

function boot() {
	return new Promise((fullfill, reject) => {
		var arg = process.argv[2] || '0.0.0.0:8080';
		
		opts = {
			address: arg.split(':')[0] || '0.0.0.0',
			port:  arg.split(':')[1] || '8080',
			service_ports: '41951-41960'
		};

		if (arg.match(/^-*h(elp)?$/)) {
			console.log([
				'Usage: node server.js [address [:port]]',
				'',
				'Options:',
				'  address   Port to use [8080]',
				'  port      Address to use [0.0.0.0]'
			].join('\n'));
			process.exit();
		}

		fullfill(opts);
	});
}

function scan() {
	var options = {
		target: '127.0.0.1',
		port: opts.service_ports,
		status: 'O', // [T]imeout, [R]efused, [O]pen, [U]nreachable
		banner: true
	};
	 
	return new Promise((fullfill, reject) => {
		var scanner = new evilscan(options);
		 
		scanner.on('result', data => fullfill(data.port));
		scanner.on('error', err => reject(new Error(err.toString())));
		scanner.on('done', () => reject(new Error('Label service not found')));

		scanner.run();
	});
}

function serve() {
	return new Promise((fullfill, reject) => {
		var target = `https://localhost:${opts.label_service_port}/`;
		console.log(`Starting server - proxying to ${target}`);
		var server = create_server({
			root: path.join(__dirname, 'public'),
			autoIndex: true,
			proxy: {
				target: target,
				secure: false,
				changeOrigin: true
			}
		});

		server.listen(parseInt(opts.port, 10), opts.address, () => fullfill(`${opts.address}:${opts.port}`));
	});
}
