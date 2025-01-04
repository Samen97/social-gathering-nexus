import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, Wand2 } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (url: string) => void;
}

export const ImageUpload = ({ onImageSelected }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generationsLeft, setGenerationsLeft] = useState(3);

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

      onImageSelected(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const generateImage = async () => {
    if (generationsLeft <= 0) {
      toast.error("No more AI generations left");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-event-image', {
        body: { prompt }
      });

      if (error) throw error;
      onImageSelected(data.imageUrl);
      setGenerationsLeft(prev => prev - 1);
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Error generating image");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <div className="text-sm text-muted-foreground">
          Or generate an image using AI ({generationsLeft} generations left)
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating || generationsLeft <= 0}
          />
          <Button
            onClick={generateImage}
            disabled={!prompt || isGenerating || generationsLeft <= 0}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};