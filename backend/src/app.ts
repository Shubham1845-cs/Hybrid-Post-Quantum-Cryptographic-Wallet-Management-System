import express,{Application}  from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler';

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
app.use(errorHandler);
app.listen(5000, () => console.log('Server running on port 5000'));
export default app;