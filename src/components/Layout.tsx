import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = (role: UserRole): string => {
    switch (role) {
      case 'worker':
        return '/dashboard/worker';
      case 'senior-worker':
        return '/dashboard/senior-worker';
      case 'supervisor':
        return '/dashboard/supervisor';
      case 'manager':
        return '/dashboard/manager';
      default:
        return '/';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg rotate-45 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold -rotate-45">CC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Chennai CleanUp</h1>
                <p className="text-xs text-blue-100">Greater Chennai Corporation</p>
              </div>
            </Link>

            <nav className="flex items-center space-x-6">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/report"
                    className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-white font-medium"
                  >
                    Report Dump
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Staff Login
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardRoute(user!.role)}
                    className={`hover:text-blue-100 transition-colors ${
                      isActive(getDashboardRoute(user!.role)) ? 'font-semibold' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  {(user!.role === 'worker' || user!.role === 'senior-worker') && (
                    <Link
                      to="/jobs"
                      className={`hover:text-blue-100 transition-colors ${
                        isActive('/jobs') ? 'font-semibold' : ''
                      }`}
                    >
                      Available Jobs
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`hover:text-blue-100 transition-colors ${
                      isActive('/profile') ? 'font-semibold' : ''
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors border border-white shadow-md"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* User Info Bar (for authenticated users) */}
      {isAuthenticated && user && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-700">{user.name}</span>
                <span className="px-2 py-1 bg-chennai-blue text-white rounded text-xs uppercase">
                  {user.role.replace('-', ' ')}
                </span>
                {user.zone && (
                  <span className="text-gray-600">Zone: {user.zone}</span>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.status === 'free'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {user.status === 'free' ? '● Available' : '● Busy'}
                </span>
              </div>
              <div className="text-gray-600">
                Tasks Today: {user.completedToday}/{user.dailyQuota}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm">
              &copy; 2024 Chennai CleanUp - Greater Chennai Corporation
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Making Chennai cleaner, one report at a time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
