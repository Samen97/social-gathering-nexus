import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  created_by: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  };
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  };
}

export const NoticeBoard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

  const { data: notices, isLoading, refetch } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select(`
          *,
          profiles (
            full_name
          ),
          comments: notice_comments (
            id,
            content,
            created_at,
            profiles (
              full_name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notice[];
    },
  });

  const handleAddComment = async (noticeId: string) => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    const comment = newComments[noticeId];
    if (!comment?.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("notice_comments").insert({
      notice_id: noticeId,
      content: comment,
      created_by: session.user.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
      return;
    }

    setNewComments((prev) => ({ ...prev, [noticeId]: "" }));
    refetch();
  };

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

      <div className="space-y-6">
        {notices?.map((notice) => (
          <div
            key={notice.id}
            className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
          >
            <h3 className="font-semibold text-lg mb-2">{notice.title}</h3>
            <p className="text-gray-600 mb-2">{notice.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>Posted by {notice.profiles.full_name || "Anonymous"}</span>
              <span>
                {new Date(notice.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Comments Section */}
            <div className="mt-4 space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Comments</h4>
              <div className="space-y-3">
                {notice.comments?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">{comment.content}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {comment.profiles.full_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              {session && (
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Add a comment..."
                    value={newComments[notice.id] || ""}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [notice.id]: e.target.value,
                      }))
                    }
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddComment(notice.id)}
                  >
                    Comment
                  </Button>
                </div>
              )}
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