import {Router} from 'express';
import { generateWallet, getWallet } from 'src/controllers/walletController';

const router=Router();

router.post('/generate',generateWallet);

router.get('/:address',getWallet);
export default router;