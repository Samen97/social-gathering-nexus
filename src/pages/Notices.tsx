import { NoticeBoard } from "@/components/NoticeBoard";
import { Navbar } from "@/components/Navbar";

const Notices = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <NoticeBoard />
      </main>
    </div>
  );
};

export default Notices;