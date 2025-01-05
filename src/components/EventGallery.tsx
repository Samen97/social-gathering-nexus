import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

interface EventGalleryProps {
  eventId: string;
  images: string[];
  isHost: boolean;
  onImagesChange: () => void;
}

export const EventGallery = ({ eventId, images, isHost, onImagesChange }: EventGalleryProps) => {
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

      // Get existing images
      const { data: event } = await supabase
        .from('events')
        .select('image_urls')
        .eq('id', eventId)
        .single();

      const currentImages = event?.image_urls || [];
      const updatedImages = [...currentImages, publicUrl];

      const { error: updateError } = await supabase
        .from('events')
        .update({ image_urls: updatedImages })
        .eq('id', eventId);

      if (updateError) throw updateError;

      onImagesChange();
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const { data: event } = await supabase
        .from('events')
        .select('image_urls')
        .eq('id', eventId)
        .single();

      const currentImages = event?.image_urls || [];
      const updatedImages = currentImages.filter(url => url !== imageUrl);

      const { error: updateError } = await supabase
        .from('events')
        .update({ image_urls: updatedImages })
        .eq('id', eventId);

      if (updateError) throw updateError;

      onImagesChange();
      toast.success("Image removed successfully!");
    } catch (error) {
      toast.error("Error removing image");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Event Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={imageUrl}
              alt={`Event gallery ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
            {isHost && (
              <button
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        
        {isHost && (
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="gallery-upload"
            />
            <label
              htmlFor="gallery-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <>
                  <Plus className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Add photo</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};