import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminLogin from "./pages/admin/Login";
import AdminSetup from "./pages/admin/Setup";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/Services";
import AdminAvailability from "./pages/admin/Availability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/availability" element={<AdminAvailability />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
