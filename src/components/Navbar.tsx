import { Link, useLocation } from 'react-router-dom';
import { Sparkles, PenTool, Settings, FolderOpen } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const publicPages = ['/', '/about', '/pricing', '/privacy', '/terms', '/contact', '/signup'];
  const isPublicPage = publicPages.includes(location.pathname) || location.pathname.startsWith('/signup/');

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Messynotes.ai</span>
            </Link>
          </div>

          {isPublicPage ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/pricing"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Contact
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/new-project"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <PenTool className="h-5 w-5 mr-1" />
                New Project
              </Link>
              <Link
                to="/my-projects"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <FolderOpen className="h-5 w-5 mr-1" />
                My Projects
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <Settings className="h-5 w-5 mr-1" />
                Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;