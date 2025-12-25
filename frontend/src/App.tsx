import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Signin from './pages/Signin';
import Deals from './pages/Deals';
import DealsDetails from './pages/DealsDetails';
import Coupons from './pages/Coupons';
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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id" element={<DealsDetails />} />
            <Route path="/coupons" element={<Coupons />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="submit-deal" element={<SubmitDeal />} />
            <Route path="deals" element={<MyDeals />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="votes" element={<Votes />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
