import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Notice } from "./types";

export const useTogglePin = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Notice ID is required");
      const notice = queryClient.getQueryData<Notice>(["notice", id]);
      const { error } = await supabase
        .from("notices")
        .update({ is_pinned: !notice?.is_pinned })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
      toast.success("Notice pin status updated");
    },
    onError: (error) => {
      console.error("Error toggling pin status:", error);
      toast.error("Failed to update notice pin status");
    },
  });
};