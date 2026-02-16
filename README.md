# FixIt - Community Problem Reporting System

A web application for citizens to report community problems (infrastructure, utilities, sanitation) which are automatically categorized using AI and assigned to relevant government departments.

**Status:** Beta Ready | **License:** MIT | **Python:** 3.13 | **React:** 18

## Quick Links
- [Installation](#installation)
- [Running](#running)
- [API Endpoints](#api-endpoints)
- [AI Features](#ai-features)

## Key Features
- User registration, login, and password reset
- Create reports with photo upload
- AI-powered auto-categorization and summaries
- Admin dashboard for report management
- JWT authentication and secure password hashing

## Tech Stack
- **Backend:** FastAPI, PostgreSQL, SQLAlchemy, JWT, Argon2
- **Frontend:** React 18, Vite, Tailwind CSS, Axios
- **AI/ML:** Scikit-learn, TF-IDF

---

## Project Structure
```
FixIt_FinalProject/
├── backend/
│   ├── app/
│   │   ├── models/        - Database models (User, Report)
│   │   ├── schemas/       - Data schemas
│   │   ├── routers/       - API endpoints
│   │   ├── core/          - Auth and security
│   │   └── db/            - Database config
│   └── ai/                - ML model and prediction
├── frontend/src/
│   ├── pages/             - Login, Register, CreateReport, Reports
│   └── Components/        - Navbar component
└── docs/                  - Documentation
```

## Installation
Prerequisites: Python 3.8+, Node.js 14+, PostgreSQL 12+

```bash
git clone https://github.com/PRAKASHYARI07/FixIt_FinalProject.git

# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

Database Setup:
```sql
CREATE DATABASE fixit_db;
```

Update `backend/app/db/database.py` with DB credentials (default: postgres/numa123)

## Running

**Backend** (Port 8000):
```bash
cd backend
python -m uvicorn app.main:app --reload
```
API Docs: http://127.0.0.1:8000/docs

**Frontend** (Port 5173):
```bash
cd frontend
npm run dev
```

## API Endpoints
- `POST /users/` - Register
- `POST /users/login` - Login
- `POST /users/forgot-password` - Password reset request
- `POST /users/reset-password` - Reset password
- `POST /reports/` - Create report
- `GET /reports/` - List reports
- `GET /reports/admin/all` - All reports (admin)
- `PUT /reports/{id}/status` - Update status

---

## AI Features
- Auto-detects issue categories (Water, Road, Sanitation)
- Scikit-learn ML model + rule-based detection
- Generates automatic summaries
- Auto-assigns to relevant departments

## License
MIT License

## Author
Prakash Yari - GitHub: @PRAKASHYARI07

---

Last Updated: February 16, 2026 | Version: 1.0.0 Beta
