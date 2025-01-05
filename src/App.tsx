import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import CreateEvent from "@/pages/CreateEvent";
import Notices from "@/pages/Notices";
import Auth from "@/pages/Auth";
import PasswordReset from "@/pages/PasswordReset";
import AdminDashboard from "@/pages/AdminDashboard";
import { Navbar } from "@/components/Navbar";

function App() {
  const session = useSession();

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/notices/*" element={<Notices />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        {/* Protected routes - require authentication */}
        <Route 
          path="/events/create" 
          element={session ? <CreateEvent /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/notices/create" 
          element={session ? <CreateEvent /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/admin" 
          element={session ? <AdminDashboard /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;