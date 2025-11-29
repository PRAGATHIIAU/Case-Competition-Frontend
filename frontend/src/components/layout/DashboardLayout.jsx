import { Outlet } from 'react-router-dom'
import { useMockData } from '../../contexts/MockDataContext'
import Sidebar from './Sidebar'

const DashboardLayout = ({ userRole = 'faculty', view }) => {
  const { currentUser } = useMockData()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userRole || currentUser?.role} view={view} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout


