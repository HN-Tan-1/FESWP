import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --------- PUBLIC PAGES ---------
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServiceTestingPage from './pages/ServiceTestingPage';
import ConsultantServicePage from './pages/ConsultantServicePage';
import ConsultantPage from './pages/ConsultantPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPublic from './components/blogs/BlogDetailPublic';
import TestSchedulePage from './pages/TestSchedulePage';
import ConsultSchedulePage from './pages/ConsultSchedulePage';

// --------- PROFILE ---------
import Profile from './components/profile/Profile';
import PersonalInfo from './components/profile/pages/PersonalInfo';
import AccountInfo from './components/profile/pages/AccountInfo';
import ReproductiveHealth from './components/profile/pages/ReproductiveHealth';
import ServiceHistory from './components/profile/pages/ServiceHistory';
import ScheduleSetupPage from './components/profile/pages/ScheduleSetupPage';

// --------- MANAGER ---------
import ManagerLayout from './components/manager/ManagerLayout';
import ManagerDashboard from './components/manager/dashboard/ManagerDashboard';
import UserManagementPage from './components/manager/UserManagement/UserManagementPage';
import ManagerCM from './components/manager/ConsultantManagement/ManagerCM';
import ManagerStaffManage from './components/manager/StaffManagement/ManagerStaffManage';
import TestingServiceManage from './components/manager/ServiceManagement/TestingServiceManage';
import ConsultingServiceManage from './components/manager/ServiceManagement/ConsultingServiceManage';
import ManagerBlogManage from './components/manager/BlogsManagement/ManagerBlogManage';
import ManagerQA from './components/manager/Q&AManagement/ManagerQA';

// --------- CONSULTANT ---------
import ConsultantLayout from './components/ConsultantManagement/ConsultantLayout';
import ConsultantDashboard from './components/ConsultantManagement/Dashboard/ConsultantDashboard';
import ConsultingSchedule from './components/ConsultantManagement/ConsultingSchedule/ConsultingSchedule';
import ConsultantQuestion from './components/ConsultantManagement/Question/ConsultantQuestion';
import ConsultantEvaluate from './components/ConsultantManagement/Evaluate/ConsultantEvaluate';
import ConsultantMessage from './components/ConsultantManagement/Message/ConsultantMessage';

// --------- STAFF ---------
import StaffLayout from './components/staff/StaffLayout';
import StaffHome from './components/staff/Home/StaffHome';
import TestScheduleSection from './components/staff/Schedule/TestScheduleSection';
import MedicalBlog from './components/staff/Blog/MedicalBlog';
import StaffBlogCreate from './components/staff/Blog/StaffBlogCreate';
import StaffBlogDetail from './components/staff/Blog/StaffBlogDetail';
import StaffBlogEdit from './components/staff/Blog/StaffBlogEdit';

// --------- ADMIN ---------
import AdminLayout from './components/admin/AdminLayout';
import Overview from './components/admin/Overview/Overview';
import UM from './components/admin/UserManagement/UM';
import Report from './components/admin/Reports/Report';
import ManagerFM from './components/admin/FeedbackManagement/ManagerFM';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* --------- PUBLIC --------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/services/testing" element={<ServiceTestingPage />} />
          <Route path="/services/consulting" element={<ConsultantServicePage />} />
          <Route path="/consultants" element={<ConsultantPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPublic />} />
          <Route path="/tests" element={<TestSchedulePage />} />
          <Route path="/consult-schedule" element={<ConsultSchedulePage />} />

          {/* --------- PROFILE --------- */}
          <Route path="/profile" element={<Profile />}>
            <Route index element={<PersonalInfo />} />
            <Route path="info" element={<PersonalInfo />} />
            <Route path="account" element={<AccountInfo />} />
            <Route path="health" element={<ReproductiveHealth />} />
            <Route path="history" element={<ServiceHistory />} />
            <Route path="schedule-setup" element={<ScheduleSetupPage />} />
          </Route>

          {/* --------- CONSULTANT --------- */}
          <Route path="/consultant" element={<ConsultantLayout />}>
            <Route index element={<ConsultantDashboard />} />
            <Route path="schedule" element={<ConsultingSchedule />} />
            <Route path="chat" element={<ConsultantMessage />} />
            <Route path="questions" element={<ConsultantQuestion />} />
            <Route path="reviews" element={<ConsultantEvaluate />} />
          </Route>

          {/* ❌ Đã xóa route: /consultants/:id */}

          {/* --------- STAFF --------- */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<StaffHome />} />
            <Route path="schedule" element={<TestScheduleSection />} />
            <Route path="blogs" element={<MedicalBlog />} />
            <Route path="blogs/create" element={<StaffBlogCreate />} />
            <Route path="blogs/:id" element={<StaffBlogDetail />} />
            <Route path="blogs/edit/:id" element={<StaffBlogEdit />} />
          </Route>

          {/* --------- ADMIN --------- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="users" element={<UM />} />
            <Route path="reports" element={<Report />} />
            <Route path="feedbacks" element={<ManagerFM />} />
          </Route>

          {/* --------- MANAGER --------- */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="consultants" element={<ManagerCM />} />
            <Route path="staffs" element={<ManagerStaffManage />} />
            <Route path="services" element={<TestingServiceManage />} />
            <Route path="consulting-services" element={<ConsultingServiceManage />} />
            <Route path="blogs" element={<ManagerBlogManage />} />
            <Route path="qna" element={<ManagerQA />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
