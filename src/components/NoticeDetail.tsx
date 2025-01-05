import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Trash2, Send } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useNavigate, useParams } from "react-router-dom";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  profiles: {
    full_name: string | null;
  };
}

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
  notice_comments: Comment[];
}

export const NoticeDetail = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: notice, isLoading } = useQuery({
    queryKey: ["notice", id],
    queryFn: async () => {
      const { data: notice, error } = await supabase
        .from("notices")
        .select(`
          *,
          profiles (
            full_name
          ),
          notice_comments (
            *,
            profiles (
              full_name
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return notice as Notice;
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      navigate("/notices");
      toast.success("Notice deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!session?.user?.id) throw new Error("Must be logged in to comment");
      
      const { error } = await supabase.from("notice_comments").insert({
        notice_id: id,
        content,
        created_by: session.user.id,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
      setNewComment("");
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    },
  });

  const handleAddComment = () => {
    if (!session) {
      toast.error("You must be logged in to comment");
      navigate("/auth");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    addCommentMutation.mutate(newComment);
  };

  if (isLoading) {
    return <div className="animate-pulse bg-white rounded-lg h-48" />;
  }

  if (!notice) {
    return <div>Notice not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{notice.title}</h1>
            <p className="text-gray-600">{notice.description}</p>
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
          {session?.user?.id === notice.created_by && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-6 mt-8">
          <h2 className="text-xl font-semibold">Comments</h2>
          <div className="space-y-4">
            {notice.notice_comments?.map((comment) => (
              <div key={comment.id} className="border-l-2 border-gray-100 pl-4 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {comment.profiles.full_name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))}

            {session && (
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleAddComment}
                  disabled={addCommentMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notice and all its comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteNoticeMutation.mutate()} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};