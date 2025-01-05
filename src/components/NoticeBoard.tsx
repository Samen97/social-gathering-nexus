import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Community Notices</h1>
        {session && (
          <Button onClick={() => navigate("/notices/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Post Notice
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notices?.map((notice) => (
          <Card
            key={notice.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/notices/${notice.id}`)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-lg">{notice.title}</span>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Posted by {notice.profiles.full_name || "Anonymous"}</p>
                <p>
                  {new Date(notice.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!notices || notices.length === 0) && (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-500">No notices posted yet.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};