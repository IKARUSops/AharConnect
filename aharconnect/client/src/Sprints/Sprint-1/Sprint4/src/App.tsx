import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../../Faiyaz/pages/Index";
import NotFound from "../../Faiyaz/pages/NotFound";
import RestaurantsPage from "../../Faiyaz/pages/customer/RestaurantsPage";
import RestaurantDetailPage from "../../Faiyaz/pages/customer/RestaurantDetailPage";
import CheckoutPage from "../../Faiyaz/pages/customer/CheckoutPage";
import RestaurantDashboardPage from "../../Faiyaz/pages/restaurant/RestaurantDashboardPage";
import ReservationsManagementPage from "../../Faiyaz/pages/restaurant/ReservationsManagementPage";
import EventSpacesPage from "../../Faiyaz/pages/customer/EventSpacesPage";
import EventBookingPage from "../../Faiyaz/pages/customer/EventBookingPage";
import EventMessagePage from "../../Faiyaz/pages/customer/EventMessagePage";
import { CartProvider } from "../../Faiyaz/context/CartContext";

const queryClient = new QueryClient();

// Create a default restaurant ID for the cart provider
const DEFAULT_RESTAURANT_ID = "default";

const Test = () => <div style={{ background: 'red', color: 'white', padding: 20 }}>ROUTER TEST - If you see this, router works</div>;

const CheckoutTest = () => <div style={{ background: 'red', color: 'white', padding: 20 }}>CHECKOUT TEST - If you see this, routing works</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider restaurantId={DEFAULT_RESTAURANT_ID}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/restaurant-dashboard" element={<RestaurantDashboardPage />} />
            <Route path="/restaurant/reservations" element={<ReservationsManagementPage />} />
            
            {/* Event Booking Routes */}
            <Route path="/events" element={<EventSpacesPage />} />
            <Route path="/events/book/:id" element={<EventBookingPage />} />
            <Route path="/events/message/:id" element={<EventMessagePage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
