import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Link as LinkIcon, Trash2, Edit2, Plus, X } from "lucide-react";
import { compressImageFile } from "@/lib/compressImage";

export interface ColorVariant {
  color: string;
  images: string[];
  stockQuantity: number;
  inStock: boolean;
}

interface ColorVariantEditorProps {
  variants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  availableColors: string[];
  adminToken: string | null;
}

export function ColorVariantEditor({ variants, onChange, availableColors, adminToken }: ColorVariantEditorProps) {
  const { toast } = useToast();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null]);
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImages, setCurrentImages] = useState<string[]>(["", "", "", "", ""]);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [inStock, setInStock] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean[]>([false, false, false, false, false]);
  const [uploadFailed, setUploadFailed] = useState<boolean[]>([false, false, false, false, false]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleImageUpload = async (slotIndex: number, file: File) => {
    setIsUploading(prev => {
      const newState = [...prev];
      newState[slotIndex] = true;
      return newState;
    });

    setUploadFailed(prev => {
      const newState = [...prev];
      newState[slotIndex] = false;
      return newState;
    });

    const compressed = await compressImageFile(file);
    const formData = new FormData();
    formData.append('images', compressed);

    try {
      const response = await fetch('/api/admin/upload-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (!data.urls || !data.urls[0]) {
        throw new Error('Invalid response from server');
      }
      
      setCurrentImages(prev => {
        const newImages = [...prev];
        newImages[slotIndex] = data.urls[0];
        return newImages;
      });
      toast({ title: "Image uploaded successfully!" });
    } catch (error: any) {
      setUploadFailed(prev => {
        const newState = [...prev];
        newState[slotIndex] = true;
        return newState;
      });
      setCurrentImages(prev => {
        const newImages = [...prev];
        newImages[slotIndex] = "";
        return newImages;
      });
      toast({ 
        title: "Upload failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsUploading(prev => {
        const newState = [...prev];
        newState[slotIndex] = false;
        return newState;
      });
    }
  };

  const handleImageUrlChange = (slotIndex: number, url: string) => {
    setCurrentImages(prev => {
      const newImages = [...prev];
      newImages[slotIndex] = url;
      return newImages;
    });
    setUploadFailed(prev => {
      const newState = [...prev];
      newState[slotIndex] = false;
      return newState;
    });
  };

  const handleAddOrUpdateVariant = () => {
    if (!selectedColor) {
      toast({ 
        title: "Color required", 
        description: "Please select a color",
        variant: "destructive" 
      });
      return;
    }

    const hasActiveUploads = isUploading.some(uploading => uploading);
    if (hasActiveUploads) {
      toast({ 
        title: "Uploads in progress", 
        description: "Please wait for all image uploads to complete before adding this color variant",
        variant: "destructive" 
      });
      return;
    }

    const validImages = currentImages.filter(img => img.trim() !== "");
    if (validImages.length === 0) {
      toast({ 
        title: "At least one image required", 
        description: "Please add at least one image for this color",
        variant: "destructive" 
      });
      return;
    }

    if (validImages.length > 5) {
      toast({ 
        title: "Too many images", 
        description: "Maximum 5 images allowed per color",
        variant: "destructive" 
      });
      return;
    }

    const hasUploadFailures = uploadFailed.some((failed, idx) => failed && currentImages[idx].trim() === "");
    if (hasUploadFailures) {
      toast({ 
        title: "Upload failed for some images", 
        description: "Please retry failed uploads or remove them before adding this color variant",
        variant: "destructive" 
      });
      return;
    }

    if (stockQuantity < 0) {
      toast({ 
        title: "Invalid stock quantity", 
        description: "Stock quantity cannot be negative",
        variant: "destructive" 
      });
      return;
    }

    const finalInStock = stockQuantity > 0 ? inStock : false;
    
    if (stockQuantity === 0 && inStock) {
      toast({ 
        title: "Stock adjusted", 
        description: "Stock quantity is 0, so this color variant will be marked as out of stock.",
        variant: "default"
      });
    }

    if (editingIndex !== null) {
      const updatedVariants = [...variants];
      updatedVariants[editingIndex] = { 
        color: selectedColor, 
        images: validImages,
        stockQuantity: stockQuantity,
        inStock: finalInStock
      };
      onChange(updatedVariants);
      toast({ title: "Color variant updated!" });
      setEditingIndex(null);
    } else {
      if (variants.some(v => v.color === selectedColor)) {
        toast({ 
          title: "Color already exists", 
          description: "This color has already been added",
          variant: "destructive" 
        });
        return;
      }
      onChange([...variants, { 
        color: selectedColor, 
        images: validImages,
        stockQuantity: stockQuantity,
        inStock: finalInStock
      }]);
      toast({ title: "Color variant added successfully!" });
    }

    setSelectedColor("");
    setCurrentImages(["", "", "", "", ""]);
    setStockQuantity(0);
    setInStock(true);
    setUploadFailed([false, false, false, false, false]);
  };

  const handleEditVariant = (index: number) => {
    const variant = variants[index];
    setSelectedColor(variant.color);
    const paddedImages = [...variant.images];
    while (paddedImages.length < 5) {
      paddedImages.push("");
    }
    setCurrentImages(paddedImages);
    setStockQuantity(variant.stockQuantity || 0);
    setInStock(variant.inStock !== undefined ? variant.inStock : true);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
    toast({ title: "Color variant removed" });
  };

  const handleCancelEdit = () => {
    setSelectedColor("");
    setCurrentImages(["", "", "", "", ""]);
    setStockQuantity(0);
    setInStock(true);
    setUploadFailed([false, false, false, false, false]);
    setEditingIndex(null);
  };

  const removeImage = (slotIndex: number) => {
    setCurrentImages(prev => {
      const newImages = [...prev];
      newImages[slotIndex] = "";
      return newImages;
    });
    setUploadFailed(prev => {
      const newState = [...prev];
      newState[slotIndex] = false;
      return newState;
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingIndex !== null ? "Edit Color Variant" : "Add Color Variant"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color-select" data-testid="label-color-select">
              Select Color *
            </Label>
            <Select 
              value={selectedColor} 
              onValueChange={setSelectedColor}
            >
              <SelectTrigger data-testid="select-color">
                <SelectValue placeholder="Choose a color" />
              </SelectTrigger>
              <SelectContent>
                {availableColors.map((color) => (
                  <SelectItem 
                    key={color} 
                    value={color}
                    data-testid={`option-color-${color.toLowerCase()}`}
                  >
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock-quantity" data-testid="label-stock-quantity">
                Stock Quantity *
              </Label>
              <Input
                id="stock-quantity"
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                data-testid="input-stock-quantity"
              />
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center gap-2 h-9">
                <input
                  id="in-stock"
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-4 w-4"
                  data-testid="checkbox-in-stock"
                />
                <Label htmlFor="in-stock" className="cursor-pointer" data-testid="label-in-stock">
                  In Stock
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label data-testid="label-color-images">
              Product Images (1-5 images required) *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4].map((slotIndex) => (
                <Card key={slotIndex} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Image {slotIndex + 1}</span>
                    {currentImages[slotIndex] && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeImage(slotIndex)}
                        data-testid={`button-remove-image-${slotIndex}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {currentImages[slotIndex] ? (
                    <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
                      <img 
                        src={currentImages[slotIndex]} 
                        alt={`Preview ${slotIndex + 1}`}
                        className="w-full h-full object-cover"
                        data-testid={`img-preview-${slotIndex}`}
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}

                  <input
                    ref={el => fileInputRefs.current[slotIndex] = el}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(slotIndex, file);
                    }}
                    data-testid={`input-file-${slotIndex}`}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fileInputRefs.current[slotIndex]?.click()}
                    disabled={isUploading[slotIndex]}
                    data-testid={`button-upload-${slotIndex}`}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading[slotIndex] ? "Uploading..." : "Upload"}
                  </Button>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Or paste image URL"
                      value={currentImages[slotIndex]}
                      onChange={(e) => handleImageUrlChange(slotIndex, e.target.value)}
                      data-testid={`input-url-${slotIndex}`}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      data-testid={`button-url-${slotIndex}`}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddOrUpdateVariant}
              data-testid="button-add-color-variant"
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingIndex !== null ? "Update Color Variant" : "Add Color Variant"}
            </Button>
            {editingIndex !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Color Variants ({variants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <Card key={index} data-testid={`card-variant-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge data-testid={`badge-color-${index}`}>{variant.color}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {variant.images.length} image{variant.images.length !== 1 ? 's' : ''}
                          </span>
                          <Badge variant={(variant.inStock ?? true) ? "default" : "secondary"} data-testid={`badge-stock-status-${index}`}>
                            Stock: {variant.stockQuantity ?? 0}
                          </Badge>
                          <Badge variant={(variant.inStock ?? true) ? "default" : "secondary"} data-testid={`badge-availability-${index}`}>
                            {(variant.inStock ?? true) ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {variant.images.map((img, imgIndex) => (
                            <div 
                              key={imgIndex} 
                              className="w-16 h-16 rounded-md overflow-hidden bg-muted"
                              data-testid={`img-thumb-${index}-${imgIndex}`}
                            >
                              <img 
                                src={img} 
                                alt={`${variant.color} ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => handleEditVariant(index)}
                          data-testid={`button-edit-variant-${index}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => handleRemoveVariant(index)}
                          data-testid={`button-remove-variant-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
