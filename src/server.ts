import * as express from 'express';
import * as http from 'http';
import * as url from 'url';
import * as WebSocket from 'ws';

import { UserMessage } from './models';
import { Request } from 'express-serve-static-core';

const app = express();
const port: number = 8999;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../public/'));

let wsAlive: boolean;

// Init http server
const server = http.createServer(app);

// Init WebSocket server
const wss = new WebSocket.Server({ server });

// Client List
const clientAddresses: Array<string|undefined> = [];

try {
        wss.on('connection', (ws: WebSocket, req: Request) => {
                ws.send('Connected.');
                let address: string | undefined = req.connection.remoteAddress;
                let reqUrl: string  = req.url;
                clientAddresses.push(address);
                console.log(`Connection established from: ${reqUrl} - ${address}`);


                wsAlive = true;
        
                ws.on('pong', () => {
                        wsAlive = true;
                });
        
                ws.on('message', (message: string) => {
                        console.log(`Received: ${message}`);
                        let response: string = 'Heard you loud and clear';
                        message.split(' ').forEach(word => {
                                if (word == 'hello') {
                                        response = 'Hello to you, too!';
                                }
                        });
                        ws.send(response);
                });
        });
} catch (error) {
        console.error(error);
}

setInterval(() => {
        wss.clients.forEach((ws: WebSocket) => {
                
                if (!wsAlive) return ws.terminate();

                wsAlive = false;
                ws.ping(null, false, true);
        });
}, 10000);


app.get('/', (req, res) => {
        res.render('pages/home');
})

server.listen(port, () => {
        console.log(`Server started on port ${server.address().port} :)`);
});

