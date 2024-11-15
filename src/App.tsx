import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { VehiclesPage } from './pages/VehiclesPage';
import { AddVehiclePage } from './pages/AddVehiclePage';
import { EditVehiclePage } from './pages/EditVehiclePage';
import { UsersPage } from './pages/admin/UsersPage';
import { EditUserPage } from './pages/admin/EditUserPage';
import { SourcesPage } from './pages/admin/SourcesPage';
import { LocationsPage } from './pages/admin/LocationsPage';
import { DesklogPage } from './pages/DesklogPage';
import { useThemeStore } from './store/useThemeStore';
import { useStore } from './store/useStore';
import { MobileHeader } from './components/MobileHeader';

export default function App() {
  const { isDarkMode } = useThemeStore();
  const { initializeStore, users, setCurrentUser } = useStore();

  // Initialize the store
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Set first admin user as current user for testing
  useEffect(() => {
    if (users.length > 0) {
      const adminUser = users.find(user => user.role === 'admin');
      if (adminUser) {
        setCurrentUser(adminUser);
      } else {
        setCurrentUser(users[0]);
      }
    }
  }, [users, setCurrentUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="hidden md:flex w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader />
          
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/add" element={<AddVehiclePage />} />
                <Route path="/vehicles/edit/:id" element={<EditVehiclePage />} />
                <Route path="/desklog" element={<DesklogPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/users/edit/:id" element={<EditUserPage />} />
                <Route path="/admin/sources" element={<SourcesPage />} />
                <Route path="/admin/locations" element={<LocationsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}