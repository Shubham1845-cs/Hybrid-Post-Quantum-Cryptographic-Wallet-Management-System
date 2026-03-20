import {Router} from 'express';
import { exportWallet, generateWallet, getWallet } from '../controllers/walletController';

const router=Router();

router.post('/generate',generateWallet);

router.get('/:address',getWallet);

router.get('/:address/export',exportWallet);
export default router;