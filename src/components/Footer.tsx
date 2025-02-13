import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Messynotes.ai</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Transform messy notes into professional content.
            </p>
          </div>

          {/* Links Columns */}
          <div className="col-span-3 grid grid-cols-3 gap-8">
            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                PRODUCT
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/pricing" className="text-base text-gray-600 hover:text-indigo-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-base text-gray-600 hover:text-indigo-600">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                SUPPORT
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/contact" className="text-base text-gray-600 hover:text-indigo-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                LEGAL
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-600 hover:text-indigo-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-600 hover:text-indigo-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Single Copyright Notice */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} Messynotes.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;