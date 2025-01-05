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
        <Route path="/auth" element={session ? <Navigate to="/" /> : <Auth />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route 
          path="/" 
          element={session ? <Index /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/about" 
          element={session ? <About /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/events" 
          element={session ? <Events /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/events/:id" 
          element={session ? <EventDetail /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/events/create" 
          element={session ? <CreateEvent /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/notices/*" 
          element={session ? <Notices /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/admin" 
          element={session ? <AdminDashboard /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;