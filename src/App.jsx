import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import { ToastProvider } from './components/ui/Toast'
import DashboardPage from './pages/DashboardPage'
import EmployeeListPage from './pages/EmployeeListPage'
import AddEmployeePage from './pages/AddEmployeePage'
import AttendancePage from './pages/AttendancePage'
import EmployeeAttendancePage from './pages/EmployeeAttendancePage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Sidebar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/add" element={<AddEmployeePage />} />
          <Route path="/employees/:id/attendance" element={<EmployeeAttendancePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
