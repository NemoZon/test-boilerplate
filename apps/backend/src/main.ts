import 'dotenv/config'
import { app } from './app';

const host: string = process.env.HOST ?? 'localhost';
const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
