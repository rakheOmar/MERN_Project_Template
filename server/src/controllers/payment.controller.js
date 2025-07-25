import crypto from 'crypto';
import { razorpay } from '../utils/razorpay.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Create a Razorpay order
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;

  const options = {
    amount: amount * 100,
    currency,
    receipt,
  };

  const order = await razorpay.orders.create(options);

  if (!order) throw new ApiError(500, 'Failed to create Razorpay order');

  res.status(200).json(new ApiResponse(200, order, 'Order created'));
});

// Verify Razorpay payment signature
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) throw new ApiError(400, 'Invalid signature, payment not verified');

  res
    .status(200)
    .json(new ApiResponse(200, { razorpay_order_id, razorpay_payment_id }, 'Payment verified'));
});
