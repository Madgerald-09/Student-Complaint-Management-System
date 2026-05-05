import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentAuth from './pages/StudentAuth';
import AdminAuth from './pages/AdminAuth';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import { Toaster } from '@/components/ui/sonner';
import { ComplaintProvider } from './lib/ComplaintContext';
import { UserProvider } from './lib/UserContext';
import './App.css';

function App() {
  return (
    <ComplaintProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student-auth" element={<StudentAuth />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/complaint/:complaintId" element={<ComplaintDetail />} />
          </Routes>
          <Toaster />
        </Router>
      </UserProvider>
    </ComplaintProvider>
  );
}

export default App;