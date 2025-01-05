import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useNoticeDelete = (id: string | undefined) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Notice ID is required");
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      navigate("/notices");
      toast.success("Notice deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    },
  });
};