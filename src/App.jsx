import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import PublicLayout from '@/components/layout/PublicLayout'
import LandingPage from '@/features/public/pages/LandingPage'
import LocationsPage from '@/features/public/pages/LocationsPage'
import LocationDetailsPage from '@/features/public/pages/LocationDetailsPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import AdminLayout from '@/features/admin/layout/AdminLayout'
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'
import AdminLocationsPage from '@/features/admin/pages/AdminLocationsPage'
import AdminUsersPage from '@/features/admin/pages/AdminUsersPage'
import AdminSubscriptionsPage from '@/features/admin/pages/AdminSubscriptionsPage'
import AdminAIPage from '@/features/admin/pages/AdminAIPage'
import AdminStatsPage from '@/features/admin/pages/AdminStatsPage'
import PublicPage from '@/features/public/pages/PublicPage'
import ProfilePage from '@/features/dashboard/pages/ProfilePage'
import ProfileEditPage from '@/features/dashboard/pages/ProfileEditPage'
import LanguageSettingsPage from '@/features/dashboard/pages/LanguageSettingsPage'
import SecurityPrivacyPage from '@/features/dashboard/pages/SecurityPrivacyPage'
import DeleteDataPage from '@/features/dashboard/pages/DeleteDataPage'
import HelpCenterPage from '@/features/dashboard/pages/HelpCenterPage'
import TermsPage from '@/features/dashboard/pages/TermsPage'
import PrivacyPage from '@/features/dashboard/pages/PrivacyPage'
import CookiePolicyPage from '@/features/dashboard/pages/CookiePolicyPage'
import AIGuidePage from '@/features/dashboard/pages/AIGuidePage'
import SavedPage from '@/features/dashboard/pages/SavedPage'
import VisitedPage from '@/features/dashboard/pages/VisitedPage'
import MapPage from '@/features/dashboard/pages/MapPage'
import ExploreWrapper from '@/features/dashboard/pages/ExploreWrapper'
import AdminSettingsPage from '@/features/admin/pages/AdminSettingsPage'
import { MaintenanceGuard } from '@/components/guards/MaintenanceGuard'

// Placeholder imports for pages we are about to create
import FeaturesPage from '@/features/public/pages/FeaturesPage'
import PricingPage from '@/features/public/pages/PricingPage'
import AboutPage from '@/features/public/pages/AboutPage'
import ContactPage from '@/features/public/pages/ContactPage'

import SmoothScroll from '@/components/ui/smooth-scroll'

function App() {
  return (
    <SmoothScroll>
      <Routes>
        {/* Standalone Pages */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes (Wrapped in PublicLayout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Generic Pages */}
          <Route path="/api" element={<PublicPage title="API Documentation" subtitle="Build on top of GastroMap." />} />
          <Route path="/showcase" element={<PublicPage title="Showcase" subtitle="See what others are discovering." />} />
          <Route path="/careers" element={<PublicPage title="Careers" subtitle="Join our team." />} />
          <Route path="/blog" element={<PublicPage title="Blog" subtitle="Stories from the kitchen." />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security" element={<SecurityPrivacyPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/status" element={<PublicPage title="System Status" subtitle="All systems operational." />} />
          <Route path="/community" element={<PublicPage title="Community" subtitle="Join the conversation." />} />
        </Route>

        {/* App Routes (With App Shell: Nav, Header) wrapped in MaintenanceGuard */}
        <Route element={<MaintenanceGuard><MainLayout /></MaintenanceGuard>}>
          <Route path="/explore" element={<ExploreWrapper />} />
          <Route path="/explore/:country" element={<ExploreWrapper />} />
          <Route path="/explore/:country/:city" element={<ExploreWrapper />} />
          <Route path="/location/:id" element={<LocationDetailsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/language" element={<LanguageSettingsPage />} />
          <Route path="/profile/security" element={<SecurityPrivacyPage />} />
          <Route path="/privacy/delete-request" element={<DeleteDataPage />} />
          <Route path="/ai-guide" element={<AIGuidePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/visited" element={<VisitedPage />} />
          <Route path="/map" element={<div className="p-4">Map View (Coming Soon)</div>} />
          <Route path="/saved" element={<div className="p-4">Saved Locations (Coming Soon)</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="locations" element={<AdminLocationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="ai" element={<AdminAIPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </SmoothScroll>
  )
}

export default App
