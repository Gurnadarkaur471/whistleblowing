# SecureVoice — Frontend

SecureVoice is a secure anonymous whistleblowing and complaint-reporting platform designed to allow users to submit incident reports, supporting evidence, and voice recordings while maintaining privacy.

This directory contains the **frontend/user-interface portion** of the SecureVoice application.

> 📌 For the complete project overview, architecture, security model, backend documentation, and setup instructions, see the [Root README](../README.md).

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Frontend Features](#-frontend-features)
* [Application Pages](#-application-pages)
* [User Workflow](#-user-workflow)
* [Admin Interface](#-admin-interface)
* [Voice Recording](#-voice-recording)
* [Evidence Upload](#-evidence-upload)
* [Technology Stack](#-technology-stack)
* [Frontend Structure](#-frontend-structure)
* [Frontend Security](#-frontend-security)
* [Backend Integration](#-backend-integration)
* [Running the Frontend](#-running-the-frontend)
* [Screenshots](#-screenshots)
* [Related Documentation](#-related-documentation)

---

## 🔎 Overview

The SecureVoice frontend provides two primary interfaces:

### 👤 Public Interface

The public interface allows users to:

* Understand the purpose of SecureVoice
* Submit anonymous complaints
* Provide incident details
* Select complaint category and severity
* Upload supporting evidence
* Record and submit voice evidence
* Receive an acknowledgement number
* Track an existing complaint
* Communicate securely with administrators

No traditional user account is required for the reporting workflow.

### 🔐 Admin Interface

The administrative interface allows authorized administrators to:

* Log in securely
* View submitted complaints
* Filter and review reports
* Examine risk and threat indicators
* View submitted evidence
* Review voice evidence
* Communicate with reporters
* Update complaint status
* Add administrative notes
* Generate forensic reports
* Review audit activity

---

# ✨ Frontend Features

## 📝 Anonymous Complaint Submission

Users can submit complaints through a structured reporting form.

The form supports information such as:

* Complaint title
* Description
* Category
* Severity
* Accused person or organization
* Location/incident information
* Optional reporter information
* Supporting evidence
* Voice/audio evidence

The interface is designed to make the reporting process straightforward while avoiding unnecessary identity exposure.

---

## 🔢 Acknowledgement Number

After submitting a complaint, the user receives an acknowledgement number.

This number can later be used to access the complaint's tracking interface.

The acknowledgement number acts as the reference for the anonymous reporting workflow.

---

## 🔍 Complaint Tracking

Users can enter their acknowledgement number to check the progress of their complaint.

The tracking interface can display information such as:

* Complaint category
* Severity
* Current status
* Last updated time
* Administrative responses
* Secure message history

---

## 💬 Secure Messaging

SecureVoice provides a communication channel between the anonymous reporter and the administrator.

The reporter does not need to reveal their identity simply to continue communicating about the complaint.

The frontend provides the interface for:

* Reading administrator messages
* Sending responses
* Continuing the complaint conversation

---

# 🎙️ Voice Recording

One of SecureVoice's notable frontend features is browser-based voice recording.

The reporting interface can use browser media capabilities to:

1. Request microphone permission.
2. Start recording.
3. Capture the user's voice.
4. Stop the recording.
5. Prepare the audio as evidence.
6. Submit it together with the complaint.

This provides an alternative to typing a complete description of an incident.

> Microphone permissions are controlled by the browser and must be granted by the user.

---

# 📎 Evidence Upload

The reporting interface supports attaching evidence to complaints.

Examples include:

* Images
* PDF documents
* Other supported documents
* Audio evidence

The frontend provides the upload interface while validation, storage restrictions, and backend processing are handled by the server.

Uploaded files are not intended to be exposed through the application's public static directories.

---

# 🖥️ Application Pages

The frontend contains interfaces for the major SecureVoice workflows.

| Page             | Purpose                                      |
| ---------------- | -------------------------------------------- |
| Home             | Introduces SecureVoice and available actions |
| Submit Report    | Allows users to submit complaints            |
| Track Report     | Allows anonymous complaint tracking          |
| Secure Messaging | Enables reporter-admin communication         |
| Admin Login      | Authenticates administrators                 |
| Dashboard        | Provides an overview of submitted reports    |
| Reports          | Displays and filters complaints              |
| Report Details   | Provides detailed investigation information  |

---

# 🔄 User Workflow

The primary reporting workflow is:

```text
User
  │
  ▼
SecureVoice Home
  │
  ▼
Submit Complaint
  │
  ├── Incident Details
  ├── Category
  ├── Severity
  ├── Optional Reporter Information
  ├── Evidence
  └── Voice Recording
  │
  ▼
Submit Report
  │
  ▼
Acknowledgement Number
  │
  ▼
Track Complaint
  │
  ▼
Secure Communication
  │
  ▼
Complaint Resolution
```

---

# 🔐 Admin Interface

The administrative frontend provides an investigation-oriented interface.

Administrators can view:

* Total complaints
* Pending complaints
* High-risk complaints
* Critical complaints
* Suspicious activity
* Complaint categories
* Recent reports
* Audit activity

Individual complaint pages provide access to detailed information and available evidence.

---

## 📊 Dashboard

The dashboard provides a high-level overview of the reporting system.

Typical dashboard information includes:

* Total reports
* Pending reports
* High-risk reports
* Critical reports
* Suspicious activity
* Category distribution
* Recent reports
* Recent administrative actions

This allows administrators to quickly identify reports requiring attention.

---

# 🧩 Technology Stack

The frontend is primarily based on server-rendered web interfaces.

| Technology         | Purpose                      |
| ------------------ | ---------------------------- |
| HTML               | Page structure               |
| CSS                | Styling and responsive UI    |
| JavaScript         | Client-side functionality    |
| EJS                | Server-rendered templates    |
| Browser Media APIs | Voice recording              |
| Express            | Serves frontend routes/views |

The frontend communicates with the SecureVoice backend through the application's routes and forms.

---

# 📁 Frontend Structure

The frontend-related structure includes views and client-side assets similar to:

```text
frontend/
│
├── views/
│   ├── home.ejs
│   ├── submit.ejs
│   ├── track.ejs
│   ├── dashboard.ejs
│   ├── reports.ejs
│   └── reportDetail.ejs
│
├── public/
│   ├── css/
│   ├── js/
│   └── assets/
│
└── README.md
```

> The exact directory structure may vary depending on the current project organization.

---

# 🛡️ Frontend Security

The frontend is designed around a privacy-first reporting experience.

Security-related frontend considerations include:

* CSRF token integration
* Secure form submission
* Input validation
* Restricted file upload interface
* Authentication-aware administrative pages
* Protected administrative actions
* Secure message interfaces
* Browser-controlled microphone permissions
* Avoidance of unnecessary identity collection

Important security operations such as encryption, hashing, authorization, rate limiting, file validation, and database security are implemented on the backend.

---

# 🔗 Backend Integration

The frontend works together with the SecureVoice backend.

```text
┌──────────────────────┐
│      Frontend        │
│                      │
│ EJS + HTML + CSS + JS│
└──────────┬───────────┘
           │
           │ HTTP Requests
           ▼
┌──────────────────────┐
│       Backend        │
│                      │
│ Express + Controllers│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       MongoDB        │
└──────────────────────┘
```

The frontend handles presentation and user interaction, while the backend handles business logic, security processing, database operations, and evidence processing.

For the complete backend architecture, see:

**[Backend README →](../backend/README.md)**

---

# 🚀 Running the Frontend

SecureVoice uses a server-rendered architecture, so the frontend is served by the backend application.

From the project root:

```bash
npm install
```

Configure the required environment variables and database connection according to the root project documentation.

Then start the application:

```bash
npm start
```

or, depending on the project configuration:

```bash
node server.js
```

The application will then be accessible through the configured local server address.

---

# 📸 Screenshots

Add your project screenshots here.

Suggested screenshots:

```text
1. Home Page
2. Complaint Submission
3. Voice Recording
4. Report Submitted / Acknowledgement
5. Complaint Tracking
6. Secure Messaging
7. Admin Login
8. Admin Dashboard
9. Reports Page
10. Report Details
```

Example:

```md
![SecureVoice Home](../docs/images/home.png)
```

---

# 📚 Related Documentation

| Documentation       | Link                                   |
| ------------------- | -------------------------------------- |
| 🏠 Complete Project | [Root README](../README.md)            |
| ⚙️ Backend          | [Backend README](../backend/README.md) |

---

## 🔒 SecureVoice

**Secure reporting. Protected identity. Evidence-driven investigation.**
