import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Plus, Trash2, MessageCircle, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  profiles: {
    full_name: string | null;
  };
}

export const NoticeBoard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);

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

      const noticesWithComments = await Promise.all(
        notices.map(async (notice) => {
          const { data: comments, error: commentsError } = await supabase
            .from("notice_comments")
            .select(`
              *,
              profiles (
                full_name
              )
            `)
            .eq("notice_id", notice.id)
            .order("created_at", { ascending: true });

          if (commentsError) throw commentsError;

          return {
            ...notice,
            comments: comments || [],
          };
        })
      );

      return noticesWithComments as Notice[];
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (noticeId: string) => {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", noticeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ noticeId, content }: { noticeId: string; content: string }) => {
      if (!session?.user?.id) throw new Error("Must be logged in to comment");
      
      const { error } = await supabase.from("notice_comments").insert({
        notice_id: noticeId,
        content,
        created_by: session.user.id,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setNewComment("");
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    },
  });

  const handleDeleteNotice = (noticeId: string) => {
    setNoticeToDelete(noticeId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noticeToDelete) {
      deleteNoticeMutation.mutate(noticeToDelete);
      setDeleteDialogOpen(false);
      setNoticeToDelete(null);
    }
  };

  const handleAddComment = (noticeId: string) => {
    if (!session) {
      toast.error("You must be logged in to comment");
      navigate("/auth");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    addCommentMutation.mutate({ noticeId, content: newComment });
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
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{notice.title}</h3>
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
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(showComments === notice.id ? null : notice.id)}
                className="text-gray-600"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {notice.comments?.length || 0} Comments
              </Button>

              {showComments === notice.id && (
                <div className="space-y-4">
                  <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                    {notice.comments?.map((comment) => (
                      <div key={comment.id} className="space-y-1">
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
                  </div>

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
                        onClick={() => handleAddComment(notice.id)}
                        disabled={addCommentMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};