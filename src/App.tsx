import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import CreateEvent from "@/pages/CreateEvent";
import Notices from "@/pages/Notices";
import Auth from "@/pages/Auth";
import AdminDashboard from "@/pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/notices/*" element={<Notices />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;