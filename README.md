# 🔐 SecureVoice – Anonymous Whistleblowing System

> A production-grade cybersecurity project built for B.Tech CSE Semester 6
> Implements AES-256 encryption, SHA-256 hashing, CSRF protection, threat detection, and a full SOC dashboard.

---

## 📁 Project Structure

```
securevoice/
├── server.js              ← Main entry point
├── setup.js               ← Creates admin account (run once)
├── .env                   ← Environment config (secrets)
├── .render-build.sh       ← Render deployment build script
│
├── models/
├── controllers/
├── routes/
├── middleware/
├── services/
├── utils/
├── views/
└── public/
    ├── css/               ← Theme stylesheets & animations
    └── js/                ← Interactive UI logic
```

---

## 🚀 HOW TO RUN (Local)

### Prerequisites
1. **Node.js** – https://nodejs.org (Download LTS version)
2. **MongoDB Atlas** – You must have a cloud database URI configured in your `.env` file (e.g., `mongodb+srv://...`).

### Setup & Launch
1. Ensure your `.env` file is fully configured with your `MONGODB_URI` and secrets.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the admin user (runs once using credentials from `.env`):
   ```bash
   node setup.js
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

---

## 🌐 URLs After Starting

| Page | Local URL |
|------|-----|
| Home | http://localhost:3000 |
| Submit Report | http://localhost:3000/report/submit |
| Track Report | http://localhost:3000/report/track |
| Admin Login | http://localhost:3000/admin/login |
| Dashboard | http://localhost:3000/admin/dashboard |

---

## 🔑 Admin Credentials

> **SECURITY NOTICE:** Hardcoded default credentials have been removed. 
> To log in as an administrator, configure the `ADMIN_EMAIL` and `ADMIN_PASSWORD` directly inside your `.env` file before executing `node setup.js`.

---

## ☁️ DEPLOYMENT (Render)

This project is configured for seamless deployment to Render.com.

1. **Push your code to GitHub.**
2. **Create a new Web Service** on Render and link your GitHub repository.
3. Configure the **Build Command** to: `chmod +x .render-build.sh && ./.render-build.sh`
4. Configure the **Start Command** to: `npm start`
5. Inject all secrets from your `.env` into the **Environment Variables** dashboard in Render.
6. Deploy!

---

## 🔐 Security Features Implemented

### 1. AES-256-CBC Encryption
- Reporter name & contact are encrypted before storing in MongoDB
- Unique IV (Initialization Vector) per encryption operation
- Decryption only accessible to authenticated admins

### 2. SHA-256 Hashing
- IP addresses hashed with salt — original IP never stored
- Content hash for integrity verification
- Blockchain-style hash chaining between reports

### 3. Threat Detection & Logic
- High-frequency submission flagging
- Suspicion score (0–100)
- Risk Scoring Engine (Severity, category, keywords calculation)

### 4. Forensic Report Engine
- PDF Generation with Puppeteer
- Strict Blockchain Block/Hash tracing and timestamping

---

## 🎓 Made By

**Gurnadar Kaur**
B.Tech CSE – Semester 6
Project: Anonymous Whistleblowing & Cybersecurity System
