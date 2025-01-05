import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Notice } from "./types";

export const useNoticeQuery = (id: string | undefined) => {
  return useQuery({
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
        .maybeSingle();

      if (error) throw error;
      return notice as Notice | null;
    },
  });
};