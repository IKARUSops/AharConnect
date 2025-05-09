import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import AppTheme from './shared-theme/AppTheme';
import ColorModeSelect from './shared-theme/ColorModeSelect';
import SignInSide from './sign-in-side/SignInSide';
import Signup from './sign-up/SignUp';  
import CustomNavbar from "./common-components/CustomNavbar";
import Footer from "./common-components/Footer";
import Expenses from './Sprints/Sprint-1/Expenses/Expenses';
import MenuEditDashboard from './Sprints/Sprint-1/Menu/Menu';
import RestaurantsPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/RestaurantsPage";
import RestaurantDetailPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/RestaurantDetailPage";
import CheckoutPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/CheckoutPage";
import EventSpacesPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/EventSpacesPage";
import EventBookingPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/EventBookingPage";
import EventMessagePage from "./Sprints/Sprint-1/Faiyaz/pages/customer/EventMessagePage";
import RestaurantDashboard from "./Sprints/Sprint-2/RestaurantDashboard/RestaurantDashboard";
import { CartProvider } from "./Sprints/Sprint-1/Faiyaz/context/CartContext";

// Commented out imports for missing files
// import Index from "./Sprints/Sprint-1/Faiyaz/pages/Index";
// import NotFound from "./Sprints/Sprint-1/Faiyaz/pages/NotFound";
// import RestaurantDashboardPage from "./Sprints/Sprint-1/Faiyaz/pages/restaurant/RestaurantDashboardPage";
// import ReservationsManagementPage from "./Sprints/Sprint-1/Faiyaz/pages/restaurant/ReservationsManagementPage";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: -1,
              },
              '&::after': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                zIndex: -2,
              }
            }}
          >
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }} />
            <CustomNavbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: '100%',
                mx: 'auto',
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2, sm: 3 },
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Routes>
                <Route path="/" element={<SignInSide />} />
                {/* <Route path="/about" element={<About />} /> */}
                {/* <Route path="register" element={<Signup />}></Route> */}
                <Route path="/sign-in" element={<SignInSide />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/menu-edit" element={<MenuEditDashboard />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                {/* Event Booking Routes */}
                <Route path="/events" element={<EventSpacesPage />} />
                <Route path="/events/book/:id" element={<EventBookingPage />} />
                <Route path="/events/message/:id" element={<EventMessagePage />} />
                  
                {/* Restaurant Dashboard Route */}
                <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </AppTheme>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
