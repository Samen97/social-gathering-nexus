import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  created_by: string;
  profiles: {
    full_name: string | null;
  };
}

export const NoticeBoard = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notice[];
    },
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white rounded-lg h-48" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Notice Board</h2>
        {session && (
          <Button onClick={() => navigate("/notices/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Post Notice
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notices?.map((notice) => (
          <div
            key={notice.id}
            className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
          >
            <h3 className="font-semibold text-lg mb-2">{notice.title}</h3>
            <p className="text-gray-600 mb-2">{notice.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Posted by {notice.profiles.full_name || "Anonymous"}</span>
              <span>
                {new Date(notice.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
        
        {(!notices || notices.length === 0) && (
          <p className="text-gray-500 text-center py-4">
            No notices posted yet.
          </p>
        )}
      </div>
    </div>
  );
};