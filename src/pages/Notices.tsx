import { NoticeBoard } from "@/components/NoticeBoard";
import { NoticeDetail } from "@/components/NoticeDetail";
import { Routes, Route } from "react-router-dom";
import CreateNotice from "./CreateNotice";

const Notices = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route index element={<NoticeBoard />} />
          <Route path="create" element={<CreateNotice />} />
          <Route path=":id" element={<NoticeDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default Notices;