import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Internship from "./pages/Internship";
import Careers from "./pages/Careers";
import Features from "./pages/Features";
import Works from "./pages/Works";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminStudents from "./pages/admin/Students";
import Applications from "./pages/admin/Applications";
import Mentor from "./pages/admin/mentor";
import Colleges from "./pages/admin/college";
import Courses from "./pages/admin/courses";
import Domains from "./pages/admin/domain";
import StudentRoute from "./components/student/StudentRoute";
import StudentDashboard from "./pages/student/StudentDashboard";
import TaskHistory from "./pages/student/TaskHistory";
import FeedbackPage from "./pages/student/Feedback";
import ProfilePage from "./pages/student/Profile";
import AttendancePage from "./pages/student/Attendance";
import WeeklyReportPage from "./pages/student/WeeklyReport";  
import MentorRoute from "./components/mentor/MentorRoute";
import Tasks from "./pages/admin/tasks";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminUpdates from "./pages/admin/AdminUpdates";
import CollegeDashboard from "./pages/mentor/CollegeDashboard";
import IndustryDashboard from "./pages/mentor/IndustryDashboard";
import MentorStudents from "./pages/mentor/Students";
import MentorAttendance from "@/pages/mentor/Attendance";
import MentorUpdates from "@/pages/mentor/Updates";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/internship" element={<Layout><Internship /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          <Route path="/features" element={<Layout><Features /></Layout>} />
          <Route path="/works" element={<Layout><Works /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="*" element={<NotFound />} />
         <Route path="/admin/dashboard"element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/admin/users"element={<ProtectedRoute><Users /></ProtectedRoute>}/>
          <Route path="/admin/students" element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/admin/mentor" element={<ProtectedRoute><Mentor /></ProtectedRoute>} />
          <Route path="/admin/colleges" element={<ProtectedRoute><Colleges /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/admin/domains" element={<ProtectedRoute><Domains /></ProtectedRoute>} />
          <Route path="/admin/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/admin/updates" element={<ProtectedRoute><AdminUpdates /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute><AdminAttendance /></ProtectedRoute>} />
          <Route path="/create-account/:token" element={<Signup />} />
          <Route path="/student/StudentDashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/student/feedback" element={<StudentRoute><FeedbackPage /></StudentRoute>} />
          <Route path="/student/taskhistory" element={<StudentRoute><TaskHistory /></StudentRoute>} />
          <Route path="/student/profile" element={<StudentRoute><ProfilePage /></StudentRoute>} />
          <Route path="/student/Attendance" element={<StudentRoute><AttendancePage /></StudentRoute>} />
          <Route path="/student/WeeklyReport" element={<StudentRoute><WeeklyReportPage /></StudentRoute>} />
         {/* COLLEGE MENTOR */}
<Route path="/mentor/college/dashboard" element={<MentorRoute><CollegeDashboard /></MentorRoute>} />
<Route path="/mentor/college/students" element={<MentorRoute><MentorStudents /></MentorRoute>} />
<Route path="/mentor/college/attendance" element={<MentorRoute><MentorAttendance /></MentorRoute>} />
<Route path="/mentor/college/updates" element={<MentorRoute><MentorUpdates /></MentorRoute>} />

{/* INDUSTRY MENTOR */}
<Route path="/mentor/industry/dashboard" element={<MentorRoute><IndustryDashboard /></MentorRoute>} />
<Route path="/mentor/industry/students" element={<MentorRoute><MentorStudents /></MentorRoute>} />
<Route path="/mentor/industry/attendance" element={<MentorRoute><MentorAttendance /></MentorRoute>} />
<Route path="/mentor/industry/updates" element={<MentorRoute><MentorUpdates /></MentorRoute>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
