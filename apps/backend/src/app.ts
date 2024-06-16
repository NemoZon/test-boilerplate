import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import { ActionTypeRouter } from './actionType/';

export const app: Express = express();

const corsOptions: CorsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json())
app.use(cors(corsOptions))

app.use('/api/actiontype', ActionTypeRouter)

