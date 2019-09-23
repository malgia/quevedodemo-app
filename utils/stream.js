const { spawn } = require('child_process');
const filter = require('stream-filter');

const { server } = require('./config');


const detectionStream = spawn('node', ['utils/detection.js']);
detectionStream.stdout.setDefaultEncoding('binary');

const stream = () => {

	detectionStream.stdout.on('data', (data) => {
		console.log('frame');
	});

	detectionStream.stderr.on('data', (data) => {
		console.log('stderr: ' + data.toString());
	});

	detectionStream.on('exit', (code) => {
		console.log('child process exited with code ' + code.toString());
	});
};

module.exports = stream;
