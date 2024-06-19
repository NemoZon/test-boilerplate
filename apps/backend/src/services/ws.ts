import http, { IncomingMessage } from 'http';
import WebSocket, { Server } from 'ws';
import { Express } from 'express';

export class WS {
    private server: http.Server;
    private clients: Set<WebSocket> = new Set();
    private wss: Server<typeof WebSocket, typeof IncomingMessage>;

    public create(app: Express): WebSocket.Server {
        this.server = http.createServer(app);
        this.wss = new WebSocket.Server({ server: this.server });
        return this.wss
    }

    public start(port: string | number, cb?: () => void) {
        this.server.listen(port, () => {
            if (cb) {
                cb()
            }
            console.log(`WSS is listening on port ${process.env.WSS_PORT || 8000}`);
        });
    }

    public sendDataToAllClients(data: object) {
        const dataJSON = JSON.stringify(data);
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(dataJSON);
            }
        }
    }

    public onConnection(cb: (websocket: WebSocket) => void) {
        if (!this.wss) {
            console.error("WSS onConnection: wss is not created")
            return;
        }
        this.wss.on('connection', (ws) => {
            this.clients.add(ws);
            ws.on('close', () => {
                this.clients.delete(ws);
            });
            cb(ws)
        });
    }
}