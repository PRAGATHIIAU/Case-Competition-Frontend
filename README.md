# CMIS Engagement Platform - Frontend

A modern, responsive React frontend for the CMIS Engagement Platform, built for Texas A&M University's Mays Business School.

## 🚀 Quick Start

**Want to run it right now?** See [QUICK_START.md](./QUICK_START.md)

**Need detailed setup?** See [SETUP.md](./SETUP.md)

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## ⚡ Fast Setup (3 Steps)

1. Open terminal in the `frontend` folder
2. Run: `npm install` (first time only)
3. Run: `npm run dev`
4. Open browser to `http://localhost:3000`

That's it! 🎉

---

## Features

### Student Dashboard
- **Upcoming Events**: View and RSVP to events with real-time status updates
- **Competition Center**: Upload deliverables, track submission status, and manage team registration
- **Mentor Recommendations**: AI-powered mentor matching with match scores and skills alignment
- **Notifications Panel**: Real-time alerts for deadlines, matches, and events
- **Profile Management**: Resume upload with AI-powered parsing and skill extraction

### Judge Dashboard
- **Scoring Modal**: Interactive scoring interface with sliders for each category
- **Auto-calculating Total Score**: Real-time score updates as judges adjust sliders
- **Leaderboard**: Live team rankings with visual indicators for top performers
- **Rubrics Panel**: Comprehensive scoring guidelines and criteria

### Admin Dashboard
- **Analytics Dashboard**: Engagement trends and industry interest visualizations
- **Stats Cards**: Key metrics including active students, alumni engagement, and NPS scores
- **Engagement Charts**: 
  - Line chart showing engagement trends over time
  - Pie chart displaying student industry interests
- **Communication Center**: AI-powered email personalization and preview

## Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Vite** - Build tool

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── student/
│   │   │   ├── EventCard.jsx
│   │   │   ├── CompetitionCenter.jsx
│   │   │   ├── MentorRecommendations.jsx
│   │   │   ├── NotificationsPanel.jsx
│   │   │   └── ProfileSection.jsx
│   │   ├── judge/
│   │   │   ├── ScoringModal.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── RubricsPanel.jsx
│   │   ├── admin/
│   │   │   ├── StatsCards.jsx
│   │   │   ├── EngagementCharts.jsx
│   │   │   └── CommunicationCenter.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── JudgeDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── LandingPage.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Design System

### Colors
- **Primary**: Texas A&M Maroon (#500000)
- **Primary Light**: (#700000)
- **Primary Dark**: (#300000)
- **Neutrals**: Gray scale for UI elements

### Key Features Implemented

1. **Resume Parsing Simulation**: Profile page includes animated resume upload with skill extraction
2. **Smart Matching**: Mentor cards display match percentages based on skills
3. **Automated Email Preview**: Admin communication center shows personalized email drafts
4. **Real-time Score Calculation**: Judge scoring modal updates total score instantly
5. **Responsive Design**: All components work seamlessly on desktop and mobile

## Mock Data

The application uses mock data stored in `src/data/mockData.js`. All user interactions are simulated and do not connect to a backend API. Data includes:
- Events
- Mentors
- Competition data
- Teams and scores
- Engagement metrics
- Admin statistics

## Building for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Notes

- All data is mocked for demo purposes
- No backend connection required
- Fully functional UI/UX for all user roles
- Ready for integration with backend APIs

