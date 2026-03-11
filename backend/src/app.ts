import express,{Application}  from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';

const app : Application = express();
// middleware 
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'everything is fine', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;