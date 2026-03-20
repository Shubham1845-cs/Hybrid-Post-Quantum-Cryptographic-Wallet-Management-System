import { Router } from "express";
import { createTransaction, verifyTransaction ,getTransactionHistory} from "../controllers/transactionController";

const router=Router();
router.post('/create',createTransaction);

router.post('/verify',verifyTransaction);
router.get('/history/:address',getTransactionHistory);
export default router;