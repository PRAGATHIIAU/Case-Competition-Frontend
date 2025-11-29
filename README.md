# 🏆 Case Competition Management System

A comprehensive full-stack web application for managing case competitions, student registrations, submissions, and judging. Built with React, Node.js, Express, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [User Roles & Permissions](#user-roles--permissions)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Key Features](#key-features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### 🎯 Core Features

- **Multiple Competitions Management**: Faculty/Admin can create multiple competitions simultaneously
- **Individual Competition Registration**: Students can register for each competition independently
- **Per-Competition Submissions**: Each registered competition has its own file upload area
- **Real-time Updates**: Competition list auto-refreshes every 5 seconds
- **Email Notifications**: Automatic confirmation emails on registration
- **Role-Based Access Control (RBAC)**: Different dashboards for Students, Faculty, Admin, Alumni, Mentors, Judges, and Speakers
- **Mentor-Student Connections**: Students can connect with mentors
- **Event Management**: RSVP system for lectures, workshops, and networking events
- **Competition Judging**: Judges can score and provide feedback on submissions
- **Persistent State**: Registration and submission data persists across page refreshes

### 🎨 User Interface

- Modern, responsive design with Tailwind CSS
- Smooth animations using Framer Motion
- Real-time status updates
- Drag-and-drop file uploads
- Toast notifications for user feedback

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **AWS SDK** - AWS services integration (S3, DynamoDB, SES)

### Database
- **PostgreSQL** - Primary database
- **pgAdmin** - Database management tool

## 📁 Project Structure

```
Case-competition_frontend/
├── backend/                    # Backend server
│   ├── config/                 # Configuration files
│   │   ├── database-es6.js     # Database connection
│   │   └── schema.sql          # Database schema
│   ├── controllers/            # Request handlers
│   │   ├── connection.controller.js
│   │   ├── mentor.controller.js
│   │   ├── notification.controller.js
│   │   └── search.controller.js
│   ├── models/                 # Data models
│   │   ├── Competition.js
│   │   ├── Event.js
│   │   ├── Lecture.js
│   │   ├── connection.model.js
│   │   ├── lecture.model.js
│   │   ├── mentor.model.js
│   │   └── notification.model.js
│   ├── repositories/           # Data access layer
│   │   ├── alumni.repository.js
│   │   ├── connection.repository.js
│   │   ├── industryUser.repository.js
│   │   └── notification.repository.js
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Authentication routes
│   │   ├── connection.routes.js
│   │   ├── mentors.js
│   │   ├── notification.routes.js
│   │   ├── search.routes.js
│   │   └── students.js
│   ├── services/               # Business logic
│   │   ├── connection.service.js
│   │   ├── mentor.service.js
│   │   └── notification.service.js
│   ├── scripts/                # Database scripts
│   │   ├── add-participant-flag.js
│   │   ├── create-competitions-table.js
│   │   ├── create-event-rsvps-table.js
│   │   ├── fix-students-table.js
│   │   ├── migrate.js
│   │   └── seed.js
│   ├── setup-env.js            # Environment setup
│   └── server.js               # Entry point
│
├── frontend/                    # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── admin/          # Admin components
│   │   │   │   ├── CompetitionScoresView.jsx
│   │   │   │   ├── JudgeCommentsView.jsx
│   │   │   │   └── JudgeFeedbackView.jsx
│   │   │   ├── alumni/         # Alumni components
│   │   │   │   └── MyRegisteredEvents.jsx
│   │   │   ├── speaker/       # Speaker components
│   │   │   │   └── SpeakerFeedbackList.jsx
│   │   │   ├── student/       # Student components
│   │   │   │   ├── CompetitionCenter.jsx
│   │   │   │   └── StudentCompetitions.jsx
│   │   │   └── Toast.jsx
│   │   ├── contexts/           # React contexts
│   │   │   └── MockDataContext.jsx
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   └── utils/              # Utility functions
│   │       ├── auth.js
│   │       └── permissions.js
│   └── package.json
│
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── [Setup Documentation Files]  # Various setup guides
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/PRAGATHIIAU/Case-Competition-Frontend.git
cd Case-Competition-Frontend
```

### Step 2: Database Setup

1. **Create PostgreSQL Database**

   Open **pgAdmin** or **psql** and run:

   ```sql
   CREATE DATABASE case_competition_db;
   ```

2. **Initialize Database Tables**

   ```bash
   cd backend
   npm install
   npm run init-all
   ```

   This creates all necessary tables (users, students, mentors, events, competitions, teams, etc.)

3. **Run Migration**

   ```bash
   npm run migrate:unified-identity
   ```

   This adds role-based columns (is_mentor, is_judge, is_speaker) to the users table.

4. **Seed Database (Optional - for demo data)**

   ```bash
   npm run seed
   ```

   Creates demo users and sample data. All demo passwords: `123456`

### Step 3: Backend Configuration

1. **Create `.env` file**

   ```bash
   cd backend
   copy ENV_TEMPLATE.txt .env
   ```

2. **Edit `.env` file** with your configuration:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=case_competition_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_SSL=false

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # CORS
   CORS_ORIGIN=http://localhost:3000

   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   FROM_EMAIL=your-email@gmail.com
   ADMIN_EMAIL=admin@example.com

   # AWS Configuration (Optional - for Lambda/S3/DynamoDB)
   AWS_REGION=us-east-1
   API_GATEWAY_UPLOAD_URL=
   API_GATEWAY_DYNAMODB_URL=
   API_GATEWAY_STUDENT_PROFILES_URL=
   ```

   **Note**: For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833).

### Step 4: Frontend Setup

```bash
cd frontend
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Server

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Quick Start Scripts

**Windows:**

```bash
# Start Backend
.\START_BACKEND.bat

# Start Frontend
.\START_FRONTEND.bat
```

## 👥 User Roles & Permissions

### Student
- Register for competitions
- Upload submissions per competition
- View registered competitions
- Connect with mentors
- RSVP for events

### Faculty/Admin
- Create multiple competitions
- Manage competition settings
- View all registrations
- Assign judges
- View competition scores

### Judge
- View assigned competitions
- Score submissions
- Provide feedback and comments
- View all team submissions

### Mentor
- Accept/decline student connection requests
- View mentee profiles
- Add session notes
- View mentee progress

### Alumni
- Register for events
- View registered events
- Connect with students

### Speaker
- View feedback from events
- Manage speaking engagements

## 📡 API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Competitions

- `GET /api/competitions` - Get all competitions
- `POST /api/competitions` - Create new competition (Admin/Faculty)
- `POST /api/competitions/:id/register` - Register for competition (Student)
- `GET /api/competitions/:id` - Get competition details

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Admin/Faculty)
- `POST /api/events/:id/rsvp` - RSVP for event

### Connections

- `GET /api/connections` - Get user connections
- `POST /api/connections/request` - Send connection request
- `POST /api/connections/:id/accept` - Accept connection
- `POST /api/connections/:id/decline` - Decline connection

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🗄 Database Schema

### Core Tables

- **users** - User accounts with role-based flags
- **students** - Student-specific information
- **mentors** - Mentor profiles
- **competitions** - Competition details
- **teams** - Team registrations for competitions
- **events** - Events (lectures, workshops, networking)
- **event_rsvps** - Event RSVPs
- **connections** - Mentor-student connections
- **notifications** - User notifications

See `backend/config/schema.sql` for complete schema.

## 🎯 Key Features

### Multiple Competitions Support

- Faculty can create unlimited competitions
- Each competition is independent
- Students can register for multiple competitions
- Each competition has its own registration and submission tracking

### Registration System

- Generate unique Team IDs for each registration
- Email confirmation on registration
- Persistent registration state (localStorage + database)
- Real-time registration status updates

### Submission Management

- Per-competition file uploads
- Drag-and-drop file upload interface
- Support for PDF, PPTX, DOCX formats
- Submission timestamp tracking
- Persistent file storage (localStorage)

### Real-time Updates

- Competition list auto-refreshes every 5 seconds
- Automatic detection of new competitions
- Live status updates

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U postgres -d case_competition_db

# Check if PostgreSQL is running
# Windows: Services > PostgreSQL
# Linux/Mac: sudo systemctl status postgresql
```

### Port Already in Use

```bash
# Kill process on port 5000 (Windows)
.\KILL_PORT_5000.bat

# Or manually
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Email Configuration Issues

- Ensure you're using Gmail App Password (not regular password)
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Verify `FROM_EMAIL` matches `EMAIL_USER`

### Frontend Not Connecting to Backend

- Verify backend is running on port 5000
- Check `CORS_ORIGIN` in backend `.env`
- Verify API base URL in frontend `src/services/api.js`

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Authors

- **PRAGATHIIAU** - [GitHub](https://github.com/PRAGATHIIAU)

## 🙏 Acknowledgments

- Texas A&M University
- All contributors and testers

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/PRAGATHIIAU/Case-Competition-Frontend/issues)
- Check the documentation files in the repository
- Review `SETUP_FROM_SCRATCH.md` for detailed setup instructions

---

**⭐ If you find this project helpful, please give it a star!**
