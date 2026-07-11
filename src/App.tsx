import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// App Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import ChatAssistant from './pages/chat/ChatAssistant';
import NotesGenerator from './pages/notes/NotesGenerator';
import QuizGenerator from './pages/quiz/QuizGenerator';
import PDFReader from './pages/pdf/PDFReader';
import CodingAssistant from './pages/coding/CodingAssistant';
import Research from './pages/research/Research';
import Presentations from './pages/presentations/Presentations';
import InterviewCoach from './pages/career/InterviewCoach';
import CareerCoach from './pages/career/CareerCoach';
import ResumeBuilder from './pages/career/ResumeBuilder';
import Productivity from './pages/productivity/Productivity';
import Achievements from './pages/achievements/Achievements';
import Analytics from './pages/analytics/Analytics';
import TeacherPortal from './pages/teacher/TeacherPortal';
import AdminPanel from './pages/admin/AdminPanel';
import Settings from './pages/settings/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected App */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/notes" element={<NotesGenerator />} />
            <Route path="/quiz" element={<QuizGenerator />} />
            <Route path="/pdf" element={<PDFReader />} />
            <Route path="/coding" element={<CodingAssistant />} />
            <Route path="/research" element={<Research />} />
            <Route path="/presentations" element={<Presentations />} />
            <Route path="/interview" element={<InterviewCoach />} />
            <Route path="/career" element={<CareerCoach />} />
            <Route path="/resume" element={<ResumeBuilder />} />
            <Route path="/productivity" element={<Productivity />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/teacher" element={<TeacherPortal />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
