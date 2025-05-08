import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#2C2339] text-[#C7C2D1] mt-auto">
      <div className="ahar-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-gradient-to-tr from-ahar-primary to-ahar-tertiary flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="text-xl font-bold text-white">
                Ahar<span className="text-ahar-primary">Connect</span>
              </span>
            </Link>
            <p className="mt-4 text-[#C7C2D1] opacity-80">
              Connecting restaurants and diners through an integrated dining and management platform.
            </p>
            <div className="mt-6 flex space-x-4">
              {/* Social Media Links */}
              <a href="#" className="text-white hover:text-ahar-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-ahar-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.5 17.5h-3v-9h3v9zM7 7C6.17 7 5.5 6.33 5.5 5.5S6.17 4 7 4s1.5.67 1.5 1.5S7.83 7 7 7zm11 10.5h-3v-4.95c0-1.1-.02-2.5-1.5-2.5s-1.75 1.2-1.75 2.45v5h-3v-9h2.92v1.33c.47-.9 1.62-1.5 2.72-1.5 2.93 0 3.5 1.92 3.5 4.4v4.77z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-ahar-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-ahar-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                  <circle cx="12" cy="12" r="3"/>
                  <circle cx="16.5" cy="7.5" r="1.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-[#C7C2D1]">For Restaurants</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurant-dashboard" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/partner-with-us" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Partner with us
                </Link>
              </li>
              <li>
                <Link to="/restaurant-pricing" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/restaurant-faq" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-[#C7C2D1]">For Customers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurants" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Find Restaurants
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Book Events
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-[#C7C2D1]">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#C7C2D1] hover:text-ahar-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F8F7FA] mt-8 pt-8 text-sm text-[#C7C2D1]">
          <div className="flex flex-col md:flex-row justify-between">
            <p>&copy; {new Date().getFullYear()} AharConnect. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-ahar-primary mr-4 text-[#C7C2D1]">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-ahar-primary text-[#C7C2D1]">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
