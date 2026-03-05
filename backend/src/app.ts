import express,{Application}  from 'express';
import cors from 'cors';
import helmet from 'helmet';;
import bodyParser from 'body-parser'
import { parse } from 'path';

const app : Application = express();
// middleware 
app.use(helmet());
app.use(cors({origin:'http:/localhost:3000',credentials:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/health',(req,res)=>
{
  res.status(200).json({msg:"everything is fine you start the work "})
});

export default app;