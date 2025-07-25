import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-order', verifyJWT, createOrder);
router.post('/verify', verifyJWT, verifyPayment);

export default router;
