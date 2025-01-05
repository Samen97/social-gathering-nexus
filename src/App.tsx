import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import CreateEvent from "@/pages/CreateEvent";
import Notices from "@/pages/Notices";
import Auth from "@/pages/Auth";
import AdminDashboard from "@/pages/AdminDashboard";

function App() {
  const session = useSession();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={session ? <Index /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/about" 
          element={session ? <About /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/events" 
          element={session ? <Events /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/events/:id" 
          element={session ? <EventDetail /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/events/create" 
          element={session ? <CreateEvent /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/notices/*" 
          element={session ? <Notices /> : <Navigate to="/auth" replace />} 
        />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/admin" 
          element={session ? <AdminDashboard /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;