import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { compressImageFile } from "@/lib/compressImage";

export interface JewelleryImagesState {
  images: string[];
  stockQuantity: number;
  inStock: boolean;
  isUploading: boolean[];
}

interface JewelleryImagesEditorProps {
  value: JewelleryImagesState;
  onChange: (value: JewelleryImagesState) => void;
  adminToken: string | null;
}

export function JewelleryImagesEditor({ value, onChange, adminToken }: JewelleryImagesEditorProps) {
  const { toast } = useToast();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null]);

  const updateImages = (newImages: string[]) => onChange({ ...value, images: newImages });
  const updateUploading = (newUploading: boolean[]) => onChange({ ...value, isUploading: newUploading });

  const handleImageUpload = async (slotIndex: number, file: File) => {
    const newUploading = [...value.isUploading];
    newUploading[slotIndex] = true;
    updateUploading(newUploading);

    try {
      const compressed = await compressImageFile(file);
      const formData = new FormData();
      formData.append("images", compressed);

      const response = await fetch("/api/admin/upload-images", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      if (!data.urls?.[0]) throw new Error("Invalid response");

      const newImages = [...value.images];
      newImages[slotIndex] = data.urls[0];
      onChange({ ...value, images: newImages, isUploading: value.isUploading.map((u, i) => i === slotIndex ? false : u) });
      toast({ title: "Image uploaded successfully!" });
    } catch (error: any) {
      const done = [...value.isUploading];
      done[slotIndex] = false;
      updateUploading(done);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    }
  };

  const removeImage = (slotIndex: number) => {
    const newImages = [...value.images];
    newImages[slotIndex] = "";
    updateImages(newImages);
  };

  const handleUrlChange = (slotIndex: number, url: string) => {
    const newImages = [...value.images];
    newImages[slotIndex] = url;
    updateImages(newImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images &amp; Stock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jewellery-stock" data-testid="label-jewellery-stock">Stock Quantity *</Label>
            <Input
              id="jewellery-stock"
              type="number"
              min="0"
              value={value.stockQuantity}
              onChange={(e) => onChange({ ...value, stockQuantity: parseInt(e.target.value) || 0 })}
              data-testid="input-jewellery-stock"
            />
          </div>
          <div className="space-y-2 flex items-end">
            <div className="flex items-center gap-2 h-9">
              <input
                id="jewellery-in-stock"
                type="checkbox"
                checked={value.inStock}
                onChange={(e) => onChange({ ...value, inStock: e.target.checked })}
                className="h-4 w-4"
                data-testid="checkbox-jewellery-in-stock"
              />
              <Label htmlFor="jewellery-in-stock" className="cursor-pointer" data-testid="label-jewellery-in-stock">
                In Stock
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label data-testid="label-jewellery-images">Product Images (1–5 images required) *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4].map((slotIndex) => (
              <Card key={slotIndex} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Image {slotIndex + 1}</span>
                  {value.images[slotIndex] && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeImage(slotIndex)}
                      data-testid={`button-remove-jewellery-image-${slotIndex}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {value.images[slotIndex] ? (
                  <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
                    <img
                      src={value.images[slotIndex]}
                      alt={`Preview ${slotIndex + 1}`}
                      className="w-full h-full object-cover"
                      data-testid={`img-jewellery-preview-${slotIndex}`}
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}

                <input
                  ref={(el) => (fileInputRefs.current[slotIndex] = el)}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(slotIndex, file);
                  }}
                  data-testid={`input-jewellery-file-${slotIndex}`}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRefs.current[slotIndex]?.click()}
                  disabled={value.isUploading[slotIndex]}
                  data-testid={`button-jewellery-upload-${slotIndex}`}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {value.isUploading[slotIndex] ? "Uploading..." : "Upload"}
                </Button>

                <Input
                  placeholder="Or paste image URL"
                  value={value.images[slotIndex]}
                  onChange={(e) => handleUrlChange(slotIndex, e.target.value)}
                  data-testid={`input-jewellery-url-${slotIndex}`}
                />
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
