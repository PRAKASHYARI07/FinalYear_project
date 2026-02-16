# FixIt - Community Problem Reporting System

A full-stack web application that empowers citizens to report community problems and helps government departments manage and resolve them efficiently using AI-powered categorization.

![Status](https://img.shields.io/badge/Status-Beta%20Ready-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Python](https://img.shields.io/badge/Python-3.13-blue) ![React](https://img.shields.io/badge/React-18-61DAFB)

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Setup & Configuration](#setup--configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Phases](#project-phases)
- [Contributing](#contributing)
- [Author](#author)

---

## 🎯 Features

### Citizen Features
- ✅ User Registration & Login
- ✅ Create Problem Reports with Title & Description
- ✅ Upload Photos for Reports
- ✅ AI-Powered Auto-Categorization
- ✅ Real-time AI Summary Generation
- ✅ Track Report Status (Pending → In Progress → Resolved)
- ✅ Secure Password Reset

### Admin Features
- ✅ View All Community Reports
- ✅ Update Report Status
- ✅ Filter by Category & Status
- ✅ AI-Suggested Department Assignment

### System Features
- ✅ Scikit-learn ML Model for Classification
- ✅ Rule-based Detection for Common Issues
- ✅ JWT-based Authentication
- ✅ Password Hashing (Argon2)
- ✅ CORS-Enabled API
- ✅ PostgreSQL Database

---

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Auth:** JWT (JSON Web Tokens)
- **Password:** Argon2-CFFI
- **AI/ML:** Scikit-learn, TF-IDF
- **Server:** Uvicorn

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router

### DevOps
- **Version Control:** Git & GitHub
- **Package Manager (Backend):** pip
- **Package Manager (Frontend):** npm

---

## 📁 Project Structure

```
FixIt_FinalProject/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth.py           # JWT & Authentication
│   │   │   ├── security.py       # Password Hashing
│   │   │   └── admin.py          # Admin Roles
│   │   ├── db/
│   │   │   ├── database.py       # PostgreSQL Connection
│   │   │   └── base.py           # Base Classes
│   │   ├── models/
│   │   │   ├── user.py           # User Model
│   │   │   └── report.py         # Report Model
│   │   ├── schemas/
│   │   │   ├── user.py           # User Schema
│   │   │   └── report.py         # Report Schema
│   │   ├── routers/
│   │   │   ├── user.py           # User Endpoints
│   │   │   ├── report.py         # Report Endpoints
│   │   │   └── admin.py          # Admin Endpoints
│   │   └── main.py               # FastAPI App
│   └── ai/
│       ├── predict.py            # AI Prediction Engine
│       ├── department_mapping.py  # Department Assignment
│       ├── train_model.py        # Model Training
│       └── dataset.csv           # Training Dataset
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login Page
│   │   │   ├── Register.jsx      # Registration Page
│   │   │   ├── ForgotPassword.jsx# Password Reset
│   │   │   ├── CreateReport.jsx  # Create Report with Photo
│   │   │   └── Reports.jsx       # Report Listing
│   │   ├── Components/
│   │   │   └── Navbar.jsx        # Navigation Bar
│   │   ├── api/
│   │   │   └── axios.js          # API Configuration
│   │   └── App.jsx               # Main App
│   └── package.json              # Dependencies
├── docs/
│   ├── phase1_notes.txt          # Original Phase Notes
│   └── PROJECT_PHASES_COMPLETE.txt # Full Documentation
├── progress.txt                  # Development Progress
└── requirements.txt              # Python Dependencies
```

---

## 💾 Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/PRAKASHYARI07/FixIt_FinalProject.git
cd FixIt_FinalProject/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd FixIt_FinalProject/frontend

# Install dependencies
npm install

# Or using Yarn
yarn install
```

---

## ⚙️ Setup & Configuration

### Database Setup

1. **Create PostgreSQL Database:**
```sql
CREATE DATABASE fixit_db;
```

2. **Update Backend Configuration:**

Edit `backend/app/db/database.py`:
```python
DATABASE_URL = "postgresql://username:password@localhost:5432/fixit_db"
```

**Default Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `fixit_db`
- User: `postgres`
- Password: `numa123`

### Environment Variables

Create `.env` file in backend root (optional):
```
DATABASE_URL=postgresql://postgres:numa123@localhost:5432/fixit_db
SECRET_KEY=change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🚀 Running the Application

### Backend Server

```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Server will be available at: `http://127.0.0.1:8000`

**Health Check:**
```bash
curl http://127.0.0.1:8000/
```

**Swagger API Documentation:**
Navigate to: `http://127.0.0.1:8000/docs`

### Frontend Dev Server

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Both Servers Together

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📡 API Endpoints

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/` | Register new user |
| POST | `/users/login` | Login user |
| POST | `/users/forgot-password` | Request password reset |
| POST | `/users/reset-password` | Reset password |

### Report Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reports/` | Create new report |
| GET | `/reports/` | Get user reports (citizen) or all (admin) |
| GET | `/reports/admin/all` | Get all reports (admin only) |
| PUT | `/reports/{id}/status` | Update report status |

### Health Check
| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/` | `{"message":"FixIt backend with PostgreSQL is running"}` |

---

## 🤖 AI Features

### Categorization
The system uses **rule-based detection + ML model** for categorizing reports:

- **Water/Utilities:** Detects words like "water", "leak", "pipe", "flood"
- **Traffic/Infrastructure:** Detects "pothole", "road", "street light"
- **Sanitation:** Detects "garbage", "trash", "litter", "waste"
- **ML Fallback:** Logistic Regression for other categories

### Summary Generation
Automatically generates summaries like:
- "Water or plumbing issue detected"
- "Road infrastructure issue"
- "Sanitation and waste management issue"

### Department Mapping
Auto-assigns departments:
- Illegal Parking → Traffic Department
- Noise Issues → Police Department
- Animal Abuse → Animal Control
- Graffiti → Municipality Department

---

## 📊 Database Schema

### Users Table
```sql
id (PK) | name | email (UNIQUE) | password (HASHED) | role | department | reset_token | reset_token_expires
```

### Reports Table
```sql
id (PK) | title | description | status | category | department | priority | ai_summary | suspicious_flag | photo_url | user_id (FK)
```

---

## 🔐 Security

- ✅ **Password Hashing:** Argon2 + Bcrypt
- ✅ **JWT Tokens:** Secure token-based authentication
- ✅ **CORS:** Configured for development
- ✅ **Password Reset:** 30-minute token expiration
- ✅ **Role-Based Access:** Citizen vs Admin permissions
- ✅ **SQL Injection Prevention:** SQLAlchemy ORM usage

---

## 📈 Project Phases

| Phase | Status | Details |
|-------|--------|---------|
| 1 | ✅ Complete | Data Understanding & ER Diagram |
| 2 | ✅ Complete | Use Case Diagram |
| 3 | ✅ Complete | Database Design |
| 4 | ✅ Complete | Backend API Development |
| 5 | ✅ Complete | Frontend UI Development |
| 6 | ✅ Complete | Authentication & Security |
| 7 | ✅ Complete | AI Integration |
| 8 | ✅ Complete | Photo Upload Feature |
| 9 | ✅ Complete | Password Reset Feature |
| 10 | ✅ Complete | System Integration |
| 11 | 🟡 In Progress | Testing & QA |
| 12 | 📋 Planned | Production Deployment |

See [docs/PROJECT_PHASES_COMPLETE.txt](docs/PROJECT_PHASES_COMPLETE.txt) for detailed documentation.

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User Registration
- [ ] User Login
- [ ] Create Report with Photo
- [ ] AI Categorization
- [ ] Report Listing
- [ ] Status Update (Admin)
- [ ] Password Reset
- [ ] CORS Communication

### Run Tests (Future)
```bash
cd backend
pytest
```

---

## 📝 Usage Example

### 1. Register as Citizen
```json
POST /users/
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "citizen"
}
```

### 2. Login
```json
POST /users/login
username=john@example.com&password=SecurePassword123
```

### 3. Create Report
```json
POST /reports/
Authorization: Bearer <token>
{
  "title": "Broken Streetlight",
  "description": "Streetlight near Main St is not working",
  "photo_url": "base64_encoded_image_data"
}
```

### 4. Response with AI Analysis
```json
{
  "id": 1,
  "title": "Broken Streetlight",
  "description": "Streetlight near Main St is not working",
  "category": "Traffic/Infrastructure",
  "department": "Traffic Department",
  "ai_summary": "Road infrastructure issue",
  "status": "pending",
  "user_id": 1
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Prakash Yari**
- GitHub: [@PRAKASHYARI07](https://github.com/PRAKASHYARI07)
- Email: prakash.yari@example.com

---

## 🎓 Project Context

This is a **community problem reporting system** developed as part of a software engineering project. The system enables citizens to report local issues (infrastructure, sanitation, utilities) which are automatically categorized using machine learning and assigned to relevant government departments for resolution.

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [docs/PROJECT_PHASES_COMPLETE.txt](docs/PROJECT_PHASES_COMPLETE.txt) for detailed documentation
- Review [progress.txt](progress.txt) for development timeline

---

## 🎯 Next Steps

1. **Deploy to Production** - AWS/DigitalOcean
2. **Email Notifications** - Alert users of status updates
3. **Real-time Updates** - WebSocket integration
4. **Admin Dashboard** - Analytics and metrics
5. **Mobile App** - React Native version
6. **Cloud Storage** - AWS S3 for large photos

---

**Last Updated:** February 16, 2026  
**Version:** 1.0.0 Beta  
**Status:** Ready for Testing
