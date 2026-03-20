import express,{Application}  from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import walletRoutes from './routes/walletRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app : Application = express();
// middleware 
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'everything is fine', timestamp: new Date().toISOString() });
});

app.use('/api/wallet', walletRoutes);
app.use('/api/transaction', transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});
app.use(errorHandler);
export default app;