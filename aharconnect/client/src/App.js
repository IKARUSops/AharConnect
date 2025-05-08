import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignInSide from './sign-in-side/SignInSide';
import Signup from './sign-up/SignUp';  
import CustomNavbar from "./common-components/CustomNavbar";
import Expenses from './Sprints/Sprint-1/Expenses/Expenses';
import MenuEditDashboard from './Sprints/Sprint-1/Menu/Menu';
import RestaurantsPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/RestaurantsPage";
import RestaurantDetailPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/RestaurantDetailPage";
import CheckoutPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/CheckoutPage";
import EventSpacesPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/EventSpacesPage";
import EventBookingPage from "./Sprints/Sprint-1/Faiyaz/pages/customer/EventBookingPage";
import EventMessagePage from "./Sprints/Sprint-1/Faiyaz/pages/customer/EventMessagePage";
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
        <>  
        <CustomNavbar />

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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* Commented out routes for missing files */}
          {/* <Route path="/" element={<Index />} /> */}
          {/* <Route path="/restaurant-dashboard" element={<RestaurantDashboardPage />} /> */}
          {/* <Route path="/restaurant/reservations" element={<ReservationsManagementPage />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}

        </Routes>
        </>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
