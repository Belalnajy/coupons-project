import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Signin from './pages/Signin';
import Deals from './pages/Deals';
import DealsDetails from './pages/DealsDetails';
import Coupons from './pages/Coupons';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Maintenance from './pages/Maintenance';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import MyDeals from './pages/dashboard/MyDeals';
import UserSettings from './pages/dashboard/UserSettings';
import SubmitDeal from './pages/dashboard/SubmitDeal';
import UserProfile from './pages/dashboard/UserProfile';
import Votes from './pages/dashboard/Votes';
import Notifications from './pages/dashboard/Notifications';
import { AdminLayout } from './components/layout/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminDeals from './pages/admin/AdminDeals';
import AdminDealReview from './pages/admin/AdminDealReview';
import AdminDealForm from './pages/admin/AdminDealForm';
import AdminComments from './pages/admin/AdminComments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserEdit from './pages/admin/AdminUserEdit';
import AdminStores from './pages/admin/AdminStores';
import AdminStoreEdit from './pages/admin/AdminStoreEdit';
import AdminContent from './pages/admin/AdminContent';
import AdminBannerForm from './pages/admin/AdminBannerForm';
import AdminSettings from './pages/admin/AdminSettings';
import AdminVoting from './pages/admin/AdminVoting';
import AdminReports from './pages/admin/AdminReports';
import AdminReportReview from './pages/admin/AdminReportReview';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Cookies from './pages/legal/Cookies';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Snowfall from 'react-snowfall';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { settings, loading } = useSettings();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isMaintenanceMode = settings.maintenance_mode === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#49b99f]/20 border-t-[#49b99f] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Maintenance Mode Lock */}
        {isMaintenanceMode && !isAdmin ? (
          <>
            <Route path="/signin" element={<Signin />} />
            <Route path="*" element={<Maintenance />} />
          </>
        ) : (
          <>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/deals/:id" element={<DealsDetails />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
            </Route>

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
              <Route index element={<Overview />} />
              <Route path="submit-deal" element={<SubmitDeal />} />
              <Route path="deals" element={<MyDeals />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="votes" element={<Votes />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }>
              <Route index element={<AdminOverview />} />
              <Route path="voting" element={<AdminVoting />} />
              <Route path="deals" element={<AdminDeals />} />
              <Route path="deals/new" element={<AdminDealForm />} />
              <Route path="deals/:id" element={<AdminDealReview />} />
              <Route path="comments" element={<AdminComments />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="stores/new" element={<AdminStoreEdit />} />
              <Route path="stores/edit/:id" element={<AdminStoreEdit />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/new" element={<AdminUserEdit />} />
              <Route path="users/edit/:id" element={<AdminUserEdit />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="content/new" element={<AdminBannerForm />} />
              <Route path="content/edit/:id" element={<AdminBannerForm />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="reports/:id" element={<AdminReportReview />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <SettingsProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
        <Snowfall />
      </div>
      <AppRoutes />
    </SettingsProvider>
  );
}

export default App;
