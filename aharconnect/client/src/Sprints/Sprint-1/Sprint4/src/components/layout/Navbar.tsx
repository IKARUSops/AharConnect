
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { items } = useCart();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <nav className="bg-white border-b fixed z-50 w-full top-0">
      <div className="ahar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-ahar-primary">AharConnect</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-ahar-primary border-b-2 border-transparent hover:border-ahar-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex space-x-4 items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate('/checkout')}
              >
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ahar-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
              >
                <User className="h-5 w-5" />
              </Button>
              
              <Button
                asChild
                variant="default"
              >
                <Link to="/restaurant-dashboard">
                  Restaurant Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="flex md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative mr-2"
                onClick={() => navigate('/checkout')}
              >
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ahar-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
              
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden",
        isOpen ? "block" : "hidden"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/restaurant-dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-ahar-primary hover:bg-ahar-primary/10"
            onClick={closeMenu}
          >
            Restaurant Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
