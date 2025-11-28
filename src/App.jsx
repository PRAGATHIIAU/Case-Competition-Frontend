import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MockDataProvider } from './contexts/MockDataContext'
import StudentDashboard from './components/StudentDashboard'
import IndustryDashboard from './components/IndustryDashboard'
import FacultyDashboard from './components/FacultyDashboard'
import MentorDashboard from './components/MentorDashboard'
import LandingPage from './components/LandingPage'
import DebugPanel from './components/DebugPanel'
// Enhanced versions with context integration
import EnhancedStudentDashboard from './components/EnhancedStudentDashboard'
// Keep old routes for backward compatibility
import JudgeDashboard from './components/JudgeDashboard'
import AdminDashboard from './components/AdminDashboard'
import StakeholderFeedback from './components/stakeholder/StakeholderFeedback'
import SettingsPage from './components/settings/SettingsPage'
import SearchResults from './components/search/SearchResults'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fee',
          minHeight: '100vh'
        }}>
          <h1 style={{ color: 'red' }}>⚠️ Error Loading App</h1>
          <p style={{ color: '#333', marginTop: '20px' }}>
            <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
          </p>
          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>Show Error Details</summary>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '10px', 
              marginTop: '10px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#500000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <MockDataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Main dashboards use existing components */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/industry" element={<IndustryDashboard />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/mentor" element={<MentorDashboard />} />
            {/* Enhanced version with full context integration */}
            <Route path="/student-enhanced" element={<EnhancedStudentDashboard />} />
            {/* Legacy routes for backward compatibility */}
            <Route path="/judge" element={<JudgeDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/stakeholder/feedback/:competitionId" element={<StakeholderFeedback />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Debug Panel (visible on all pages in development) */}
          <DebugPanel />
        </Router>
      </MockDataProvider>
    </ErrorBoundary>
  )
}

export default App

