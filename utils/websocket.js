const WebSocket = require('ws');

const websocket = () => {

	const wss = new WebSocket.Server({ port: 3001 });
	wss.on('connection', (ws, req) => {
	  //const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
	  ws.on('message', message => {
	    // Only raw blob data can be sent
	    //fileStream.write(Buffer.from(new Uint8Array(message)));
		console.log(Buffer.from(new Uint8Array(message)));
	  });
	});
};

module.exports = websocket;
