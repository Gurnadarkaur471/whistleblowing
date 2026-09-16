# SecureVoice — Backend

The SecureVoice backend provides the server-side architecture for the anonymous whistleblowing and complaint-reporting platform.

It is responsible for:

* Complaint processing
* Database management
* Authentication
* Encryption
* Hashing
* Threat detection
* Risk scoring
* Evidence handling
* Secure messaging
* Audit logging
* Forensic report generation
* Blockchain-style integrity verification

> 📌 For the complete project overview and frontend documentation, see the [Root README](../README.md).

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Backend Responsibilities](#-backend-responsibilities)
* [Architecture](#-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Report Processing](#-report-processing)
* [Security Architecture](#-security-architecture)
* [Encryption](#-encryption)
* [Hashing and Integrity](#-hashing-and-integrity)
* [Threat Detection](#-threat-detection)
* [Risk Scoring](#-risk-scoring)
* [Evidence Handling](#-evidence-handling)
* [Authentication and Authorization](#-authentication-and-authorization)
* [Secure Messaging](#-secure-messaging)
* [Audit Logging](#-audit-logging)
* [Forensic Reports](#-forensic-reports)
* [Database Models](#-database-models)
* [Request Flow](#-request-flow)
* [Environment Variables](#-environment-variables)
* [Installation](#-installation)
* [Running the Backend](#-running-the-backend)
* [Related Documentation](#-related-documentation)

---

# 🔎 Overview

The SecureVoice backend is built using **Node.js, Express, and MongoDB**.

It provides the server-side services required to securely receive, process, store, investigate, and track complaints.

The backend follows a modular structure separating:

* Routes
* Controllers
* Models
* Security utilities
* Business logic
* Services

---

# ⚙️ Backend Responsibilities

The backend handles the complete complaint lifecycle:

```text
Complaint Submission
        │
        ▼
Input Validation
        │
        ▼
Privacy Processing
        │
        ├── IP Hashing
        ├── Identity Encryption
        └── Content Hashing
        │
        ▼
Threat Detection
        │
        ▼
Risk Scoring
        │
        ▼
Evidence Processing
        │
        ▼
MongoDB Storage
        │
        ▼
Admin Investigation
        │
        ▼
Status / Messaging
        │
        ▼
Forensic Report
```

---

# 🏗️ Architecture

The backend follows a layered application structure.

```text
                    ┌─────────────────────┐
                    │       Client        │
                    │  Browser / Frontend │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Routes        │
                    │ Report / Admin      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Controllers      │
                    │ Business Operations │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌────────────┐   ┌─────────────┐  ┌──────────────┐
       │  Security  │   │   Services  │  │   Models     │
       │ Encryption │   │ Risk / PDF  │  │ Mongoose     │
       └────────────┘   └─────────────┘  └──────┬───────┘
                                                │
                                                ▼
                                         ┌────────────┐
                                         │  MongoDB   │
                                         └────────────┘
```

---

# 🧰 Technology Stack

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | Backend runtime            |
| Express.js         | Web framework              |
| MongoDB            | Database                   |
| Mongoose           | MongoDB ODM                |
| EJS                | Server-rendered frontend   |
| Multer             | File uploads               |
| Helmet             | HTTP security headers      |
| Express Rate Limit | Request throttling         |
| Express Validator  | Input validation           |
| Mongo Sanitize     | NoSQL injection protection |
| Puppeteer          | PDF generation             |
| AES-256            | Sensitive data encryption  |
| SHA-256            | Hashing and integrity      |
| Browser Media APIs | Audio recording            |

---

# 📁 Project Structure

The backend is organized into modular components.

```text
backend/
│
├── controllers/
│   ├── reportController.js
│   ├── adminController.js
│   └── forensicReportController.js
│
├── models/
│   ├── Report.js
│   ├── Admin.js
│   └── AuditLog.js
│
├── routes/
│   ├── reportRoutes.js
│   └── adminRoutes.js
│
├── services/
│   ├── auditService.js
│   ├── forensicReportService.js
│   ├── riskScoring.js
│   └── threatDetection.js
│
├── security/
│   ├── encryption.js
│   ├── auth.js
│   └── csrfProtection.js
│
├── utils/
│   ├── blockchain.js
│   └── upload.js
│
├── setup.js
├── server.js
└── README.md
```

> The exact folders may vary according to the final project structure.

---

# 📝 Report Processing

When a complaint is submitted, the backend performs several processing stages.

### 1. Input Validation

Incoming fields are validated before processing.

This helps prevent malformed or invalid data from entering the application.

### 2. Privacy Processing

Potentially sensitive information is protected before database storage.

Reporter information can be encrypted, while IP information is hashed.

### 3. Threat Detection

The report is checked for suspicious patterns such as:

* Duplicate submissions
* Spam-like behavior
* High-frequency submissions
* Suspicious reporting patterns

### 4. Risk Analysis

The report receives a risk score based on available report characteristics.

### 5. Evidence Processing

Uploaded files are processed according to the application's upload restrictions.

### 6. Database Storage

The processed complaint is stored in MongoDB.

### 7. Acknowledgement

An acknowledgement number is generated so the reporter can track the complaint later.

---

# 🔐 Security Architecture

Security is a core component of SecureVoice.

The backend uses multiple layers of protection rather than depending on a single security mechanism.

```text
                SecureVoice Security
                        │
       ┌────────────────┼─────────────────┐
       ▼                ▼                 ▼
   Encryption         Hashing         Validation
       │                │                 │
       ▼                ▼                 ▼
  Identity Data     IP / Content      User Input
       │                │                 │
       └────────────────┼─────────────────┘
                        ▼
                 Threat Detection
                        │
                        ▼
                  Risk Scoring
                        │
                        ▼
                  Audit Logging
                        │
                        ▼
              Integrity Verification
```

---

# 🔒 Encryption

SecureVoice uses **AES-256 encryption** for sensitive reporter information.

Potentially sensitive fields such as:

* Reporter name
* Reporter contact information

can be encrypted before being stored.

The encryption implementation uses a unique initialization vector (IV) for encryption operations.

Sensitive information is decrypted only when authorized administrative functionality requires it.

---

# #️⃣ Hashing and Integrity

SecureVoice uses **SHA-256 hashing** for integrity and privacy-related operations.

### IP Hashing

The user's IP address is not intended to be stored directly.

Instead, the system generates a salted hash.

Conceptually:

```text
IP Address
    │
    ▼
Salt
    │
    ▼
SHA-256
    │
    ▼
IP Hash
```

This allows the application to perform certain correlation or frequency checks without storing the raw IP address.

### Content Hashing

Report content can also be hashed to help identify duplicate content and support integrity verification.

---

# ⛓️ Blockchain-Style Integrity

SecureVoice includes a blockchain-inspired integrity mechanism.

The system creates chained hashes so that each integrity record can depend on the previous record.

Conceptually:

```text
Block 1
Hash A
  │
  ▼
Block 2
Previous Hash = Hash A
Hash B
  │
  ▼
Block 3
Previous Hash = Hash B
Hash C
```

If previously recorded information is modified, the resulting hash relationship can change.

This provides a **tamper-evident integrity mechanism**.

> This is a blockchain-style hash-chain implementation rather than a decentralized public blockchain network.

---

# 🚨 Threat Detection

The threat detection module analyzes submitted reports for suspicious behavior.

The implementation includes logic for detecting patterns such as:

* Duplicate report content
* Repeated submissions
* High-frequency reporting
* Spam-like patterns
* Suspicious activity

Threat indicators are associated with the report and can be displayed to administrators.

---

# 📊 Risk Scoring

SecureVoice assigns a risk score to reports using multiple characteristics.

Factors can include:

* Report severity
* Complaint category
* Attached evidence
* Accused persons/organizations
* Relevant keywords
* Potentially dangerous content indicators

The resulting score helps administrators prioritize reports for investigation.

```text
Report
  │
  ├── Severity
  ├── Category
  ├── Evidence
  ├── Accused Parties
  └── Keywords
          │
          ▼
     Risk Scoring
          │
          ▼
      Risk Score
```

The score is intended as a **triage mechanism**, not a replacement for human investigation.

---

# 📎 Evidence Handling

Evidence can be attached to complaints using the upload system.

The backend uses **Multer** for multipart file processing.

Security-related upload controls include:

* File type restrictions
* File size limits
* Randomized filenames
* Storage outside publicly accessible directories

Supported evidence can include:

* Images
* Documents
* PDFs
* Audio files

The exact allowed formats are controlled by the backend upload configuration.

---

# 🔑 Authentication and Authorization

Administrative functionality is protected by authentication.

The system provides:

* Admin login
* Session-based authentication
* Protected administrative routes
* Authorization checks
* Secure session cookies

Administrative actions are not intended to be accessible through the public reporting interface.

---

# 💬 Secure Messaging

SecureVoice supports anonymous communication between reporters and administrators.

Messages are associated with the relevant complaint.

The messaging workflow allows:

```text
Anonymous Reporter
       │
       ▼
Complaint
       │
       ▼
Secure Message
       │
       ▼
Administrator
       │
       ▼
Response
       │
       ▼
Anonymous Reporter
```

This allows investigation-related communication without requiring the reporter to create a conventional account.

---

# 📋 Audit Logging

Administrative actions are recorded using the audit logging system.

Examples include:

* Admin login
* Admin logout
* Report status changes
* Administrative replies
* Forensic PDF generation
* Integrity verification

Audit logs help provide an activity trail for administrative operations.

---

# 📄 Forensic Reports

SecureVoice can generate forensic-style PDF reports for investigated complaints.

The forensic report service can include:

* Report information
* Reporter information where authorized
* Evidence summary
* Risk information
* Threat indicators
* Hash values
* Status history
* Audit information
* Integrity information

PDF generation is handled using **Puppeteer**.

---

# 🗄️ Database Models

SecureVoice primarily uses MongoDB with Mongoose.

## Report

The `Report` model stores information such as:

```text
Report
├── acknowledgement number
├── encrypted reporter information
├── title
├── description
├── category
├── severity
├── accused information
├── evidence
├── audio evidence
├── IP hash
├── risk score
├── threat flags
├── content hash
├── previous hash
├── blockchain metadata
├── status
├── admin notes
├── messages
└── timestamps
```

---

## Admin

The `Admin` model manages administrative authentication and account information.

---

## AuditLog

The `AuditLog` model records administrative activity and provides an audit trail for important operations.

---

# 🔄 Request Flow

A typical complaint submission follows this flow:

```text
POST Request
     │
     ▼
CSRF Validation
     │
     ▼
Rate Limiting
     │
     ▼
Input Validation
     │
     ▼
File Validation
     │
     ▼
IP Hashing
     │
     ▼
Identity Encryption
     │
     ▼
Threat Detection
     │
     ▼
Risk Scoring
     │
     ▼
Content Hashing
     │
     ▼
MongoDB
     │
     ▼
Acknowledgement Number
```

---

# 🔧 Environment Variables

SecureVoice expects configuration values to be provided through environment variables.

Typical configuration includes:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
ENCRYPTION_KEY=your_encryption_key
```

Additional variables may be required depending on the final deployment configuration.

> Never commit real secrets, encryption keys, database credentials, or administrator credentials to GitHub.

A local `.env` file should be excluded using `.gitignore`.

---

# 🚀 Installation

Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd SecureVoice
npm install
```

Create the required environment configuration.

Then start the application:

```bash
npm start
```

or:

```bash
node server.js
```

The server runs on the configured port, with `3000` used as the default in the current application configuration.

---

# 🧪 Development

During development, verify the following workflows:

* Anonymous complaint submission
* Acknowledgement number generation
* Complaint tracking
* Evidence upload
* Voice recording
* Admin authentication
* Report filtering
* Status updates
* Secure messaging
* Risk scoring
* Threat detection
* Audit logging
* Forensic PDF generation
* Integrity verification

---

# 🛡️ Security Considerations

SecureVoice is designed as a security-focused prototype/application.

However, security features should not automatically be interpreted as proof that the application is production-ready.

Before real-world deployment, additional security testing should include:

* Penetration testing
* Dependency auditing
* Secure secret management
* File malware scanning
* Production TLS configuration
* Access-control testing
* Session security testing
* Encryption-key management
* Database access restrictions
* Logging/privacy review
* Secure deployment configuration

---

# 📚 Related Documentation

| Documentation       | Link                                     |
| ------------------- | ---------------------------------------- |
| 🏠 Complete Project | [Root README](../README.md)              |
| 🎨 Frontend         | [Frontend README](../frontend/README.md) |

---

## 🔒 SecureVoice

**A security-focused anonymous reporting platform for protected communication, evidence preservation, and investigation workflows.**
