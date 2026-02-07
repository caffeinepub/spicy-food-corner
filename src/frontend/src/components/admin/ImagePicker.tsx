import { useState, useRef } from 'react';
import { ExternalBlob } from '@/backend';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { validateImageFile, compressImage } from '@/utils/images';
import { toast } from 'sonner';

interface ImagePickerProps {
  value: ExternalBlob | null;
  onChange: (image: ExternalBlob | null) => void;
}

export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(
    value ? value.getDirectURL() : null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file type');
      return;
    }

    setUploading(true);

    try {
      // Compress image for mobile-friendly size
      const compressedBlob = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
      });

      // Convert to Uint8Array
      const arrayBuffer = await compressedBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Create ExternalBlob
      const externalBlob = ExternalBlob.fromBytes(uint8Array);

      // Set preview
      const previewUrl = URL.createObjectURL(compressedBlob);
      setPreview(previewUrl);

      onChange(externalBlob);
    } catch (error) {
      console.error('Image processing error:', error);
      toast.error('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative aspect-square w-full max-w-xs mx-auto border rounded-lg overflow-hidden bg-muted">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="aspect-square w-full max-w-xs mx-auto border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary transition-colors bg-muted/30"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center px-4">
            <p className="text-sm font-medium text-foreground">
              {uploading ? 'Processing...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP (max 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
