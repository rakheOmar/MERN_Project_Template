import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { sendSMS, sendWhatsApp } from './utils/twilio.js';
import { sendEmail } from './utils/email.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '16kb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.static('public'));

//ROUTE IMPORT
import userRoutes from './routes/user.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import healthRoutes from './routes/healthcheck.routes.js';

// ROUTES
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/health', healthRoutes);

// PRODUCTION TEST ROUTES
if (process.env.NODE_ENV === 'production') {
  app.get('/test-messages', async (req, res) => {
    try {
      const smsResponse = await sendSMS({ to: '+918424802961', body: 'Your OTP is 123456' });
      const whatsappResponse = await sendWhatsApp({ to: '+918424802961', body: 'Hello from dev!' });

      res.json({
        success: true,
        smsResponse,
        whatsappResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending test messages',
        error: error.message,
      });
    }
  });

  app.get('/test-email', async (req, res) => {
    try {
      const emailResponse = await sendEmail({
        to: 'rakheomar@outlook.com',
        subject: 'Testing Email Service',
        html: `<h1>Hello!</h1><p>This is a test email from the prod environment.</p>`,
      });

      res.json({
        success: true,
        emailResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending test email',
        error: error.message,
      });
    }
  });
}

export { app };
