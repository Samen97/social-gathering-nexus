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
          *,
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
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/notices/${notice.id}`)}
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{notice.title}</h3>
              <p className="text-gray-600 line-clamp-2">{notice.description}</p>
              <div className="flex text-sm text-gray-500 space-x-4">
                <span>Posted by {notice.profiles.full_name || "Anonymous"}</span>
                <span>
                  {new Date(notice.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
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