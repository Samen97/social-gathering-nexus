import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

interface Notice {
  id: string;
  title: string;
  created_at: string;
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
      const { data: notices, error } = await supabase
        .from("notices")
        .select(`
          id,
          title,
          created_at,
          profiles (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return notices as Notice[];
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
            onClick={() => navigate(`/notices/${notice.id}`)}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{notice.title}</h3>
              <div className="text-sm text-gray-500">
                {new Date(notice.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Posted by {notice.profiles.full_name || "Anonymous"}
            </p>
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