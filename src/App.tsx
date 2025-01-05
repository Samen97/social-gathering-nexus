import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

import Index from "@/pages/Index";
import Events from "@/pages/Events";
import CreateEvent from "@/pages/CreateEvent";
import EventDetail from "@/pages/EventDetail";
import Auth from "@/pages/Auth";
import About from "@/pages/About";
import Notices from "@/pages/Notices";
import CreateNotice from "@/pages/CreateNotice";
import { NoticeBoard } from "@/components/NoticeBoard";
import { NoticeDetail } from "@/components/NoticeDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/notices" element={<Notices />}>
                <Route index element={<NoticeBoard />} />
                <Route path="create" element={<CreateNotice />} />
                <Route path=":id" element={<NoticeDetail />} />
              </Route>
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;