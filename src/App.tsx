import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "@/contexts/EventContext";
import Header from "@/components/layout/Header";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EventProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/event/:eventId" element={<EventDetailsPage />} />
              <Route path="/confirmation/:registrationId" element={<ConfirmationPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
