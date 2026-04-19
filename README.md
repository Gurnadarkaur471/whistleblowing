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
├── start.bat              ← Windows one-click launcher
├── start.sh               ← Mac/Linux one-click launcher
│
├── models/
│   ├── Report.js          ← Report schema with encryption fields
│   ├── Admin.js           ← Admin with bcrypt password
│   └── AuditLog.js        ← Audit trail collection
│
├── controllers/
│   ├── reportController.js ← Submit, confirm, track reports
│   └── adminController.js  ← Login, dashboard, report management
│
├── routes/
│   ├── reportRoutes.js    ← /report/* endpoints
│   └── adminRoutes.js     ← /admin/* endpoints
│
├── middleware/
│   ├── auth.js            ← Session-based admin guard
│   ├── upload.js          ← Secure file upload (multer)
│   └── errorHandler.js    ← Global error handling
│
├── services/
│   ├── threatDetection.js ← Spam, duplicate, frequency detection
│   ├── riskScoring.js     ← AI-style keyword risk scoring
│   └── auditService.js    ← Audit log writer
│
├── utils/
│   ├── encryption.js      ← AES-256-CBC + SHA-256 utilities
│   ├── logger.js          ← Winston structured logger
│   └── tokenGenerator.js  ← Ack number & token generator
│
├── views/
│   ├── home.ejs           ← Landing page
│   ├── error.ejs          ← Error page
│   ├── partials/          ← Shared head, navbar, footer, sidebar
│   ├── report/            ← Submit, confirmation, track pages
│   └── admin/             ← Login, dashboard, reports, audit logs
│
└── public/
    ├── css/main.css       ← Full cybersecurity dark theme
    └── js/submit.js       ← Form interactions
```

---

## 🚀 HOW TO RUN (One Click)

### Prerequisites
1. **Node.js** – https://nodejs.org (Download LTS version)
2. **MongoDB Community** – https://www.mongodb.com/try/download/community
   - Install and start MongoDB service
   - Default port: 27017 (no config needed)

### Windows
```
Double-click start.bat
```
OR in VS Code terminal:
```bash
start.bat
```

### Mac / Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual (any OS)
```bash
npm install
node setup.js
node server.js
```

---

## 🌐 URLs After Starting

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Submit Report | http://localhost:3000/report/submit |
| Track Report | http://localhost:3000/report/track |
| Admin Login | http://localhost:3000/admin/login |
| Dashboard | http://localhost:3000/admin/dashboard |
| All Reports | http://localhost:3000/admin/reports |
| Audit Logs | http://localhost:3000/admin/audit-logs |

---

## 🔑 Admin Credentials (Default)

```
Email    : admin@securevoice.gov
Password : Admin@SecureVoice2024
```

> Change these in `.env` before production use!

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

### 3. CSRF Protection
- All forms include CSRF tokens
- Powered by `csurf` middleware

### 4. Rate Limiting
- Global: 200 requests / 15 min
- Report submission: 5 submissions / hour
- Admin login: 10 attempts / 15 min

### 5. Threat Detection
- Duplicate content detection
- High-frequency submission flagging
- Short/spam description detection
- Word repetition analysis
- Suspicion score (0–100)

### 6. Risk Scoring Engine
- Based on severity, category, keywords, evidence, accused count
- Levels: Low → Medium → High → Critical
- Displayed in SOC dashboard with color coding

### 7. Audit Logging
- Every admin action logged with timestamp, old/new values, IP hash
- Viewable in the Audit Logs section

### 8. Secure File Upload
- MIME type + extension double validation
- Max 5MB per file, max 3 files
- Files stored outside public directory
- Random hash filenames (strips original name)

### 9. Session Security
- httpOnly cookies
- sameSite: strict
- 2-hour expiry
- MongoDB session store

### 10. Input Validation & Sanitization
- express-validator on all form inputs
- express-mongo-sanitize (NoSQL injection prevention)
- Helmet.js (14 security headers)
- XSS-clean middleware

---

## 📊 Acknowledgement Number Format

```
SV-YYYYMMDD-XXXXXXXX
Example: SV-20240115-A3F2B1C9
```

Given to reporter on successful submission. Used to track status anonymously.

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| View Engine | EJS |
| Encryption | Node.js `crypto` (AES-256) |
| Password Hash | bcryptjs |
| Session | express-session + connect-mongo |
| Security Headers | Helmet.js |
| CSRF | csurf |
| Rate Limiting | express-rate-limit |
| Validation | express-validator |
| File Upload | Multer |
| Logging | Winston |
| Fonts | Space Grotesk, JetBrains Mono |
| Icons | Font Awesome 6 |

---

## 🎓 Made By

**Gurnadar Kaur**
B.Tech CSE – Semester 6
Project: Anonymous Whistleblowing & Cybersecurity System
