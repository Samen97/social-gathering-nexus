import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AdminEventActionsProps {
  eventId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}

export const AdminEventActions = ({ eventId, currentStatus, onStatusChange }: AdminEventActionsProps) => {
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ approval_status: newStatus })
        .eq('id', eventId);

      if (error) throw error;

      toast.success(`Event ${newStatus} successfully`);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      onStatusChange?.();
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status');
    }
  };

  if (currentStatus !== 'pending') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
        <span className="text-sm capitalize">{currentStatus}</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => handleStatusUpdate('approved')}
      >
        <Check className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => handleStatusUpdate('rejected')}
      >
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
};