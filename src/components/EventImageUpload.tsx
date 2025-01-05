import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

interface EventImageUploadProps {
  eventId: string;
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
}

export const EventImageUpload = ({ eventId, currentImageUrl, onImageUploaded }: EventImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('events')
        .update({ image_url: publicUrl })
        .eq('id', eventId);

      if (updateError) throw updateError;

      onImageUploaded(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImageUrl && (
        <img
          src={currentImageUrl}
          alt="Event"
          className="w-full h-96 object-cover rounded-lg"
        />
      )}
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </div>
    </div>
  );
};