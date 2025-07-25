# 🚀 MERN Hackathon Starter Template
A production-ready, full-stack MERN boilerplate tailored for **hackathons**, **demos**, and **quick MVPs**. Built with performance, integrations, and modularity in mind.

## 📦 Tech Stack

### 🧠 Backend
- **Express 5** with modern ES modules
- **MongoDB + Mongoose** with pagination plugin
- **JWT Auth** with refresh token support
- **Multer + Cloudinary** file uploads
- **Razorpay** Payment Gateway Integration
- **Twilio** (SMS + WhatsApp Alerts)
- **Nodemailer** Email service (SMTP)

### 💻 Frontend
- **React 19 (JSX)** with `vite` for lightning-fast builds
- **React Router DOM 7**
- **Tailwind CSS v4** + `clsx`, `tailwind-merge`
- **Lucide Icons** + `react-icons`
- **ShadCN UI + Radix Primitives** (Dialog, NavigationMenu, etc.)


## 🔋 Features
✅ Auth: Signup, Login, JWT tokens  
✅ Role-based user system (Admin / User / Courier etc.)  
✅ Drag & drop file upload with Cloudinary  
✅ Send Email / SMS / WhatsApp alerts  
✅ Razorpay payment flow  
✅ Dashboard-ready layout (ShadCN + Tailwind)  
✅ Dev/Prod-safe ENV config  
✅ Prettier + ESLint setup

## 🗂️ Folder Structure
```
project-root/
├── client/         # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # UI + forms + layout
│   │   ├── pages/       # Route pages (Home, Dashboard, Alerts, Donate, etc.)
│   │   └── App.jsx
│   └── index.html
├── server/         # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── utils/        # Razorpay, Twilio, Email, JWT, etc.
│   │   └── index.js
│   └── .env
└── README.md
```


## ⚙️ Local Setup

### Prerequisites
- Node.js v20+
- MongoDB
- Create `.env` files in both `/client` and `/server`

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
````

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```


## 🔐 .env Example (Server)
```
PORT=8000
MONGODB_URI=your_mongo_uri

JWT_SECRET=your_jwt
JWT_REFRESH_SECRET=your_refresh_jwt

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=xxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+91xxxxxxxxxx

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=your_email

CORS_ORIGIN=http://localhost:5173
```


## 📦 Scripts
### Backend
* `npm run dev` – Start backend in dev mode (Nodemon + dotenv)
### Frontend
* `npm run dev` – Start Vite dev server
* `npm run build` – Build for production


## 🧠 Use Cases This Template Can Power
* 📬 Campaigns with Razorpay donations, email + WhatsApp alerts
* 📥 Drag & drop file uploads with dashboard preview
* 📊 Community or NGO dashboards with role-based access
* 🧾 Form-to-pdf generation (with `pdf-lib`)
* 🧪 Testing Twilio/Email features during hackathon demos


## 👨‍💻 Author
**Omar Rakhe** – *Built for hackathons. Ready for production.*
> Feel free to fork, build on it, or plug in your own ideas.
> Good luck impressing the judges! 🚀
