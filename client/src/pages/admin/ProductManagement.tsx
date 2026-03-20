import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ColorVariantEditor, ColorVariant } from "@/components/ColorVariantEditor";
import { 
  Upload,
  Download,
  FileUp
} from "lucide-react";

const AVAILABLE_COLORS = [
  "Red", "Blue", "Green", "Pink", "Yellow", "Black", "White", "Purple", 
  "Maroon", "Grey", "Orange", "Beige", "Brown", "Gold", "Silver", 
  "Navy", "Turquoise", "Magenta", "Cream", "Burgundy", "Peach", "Lavender"
];

export default function ProductManagement() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const adminToken = localStorage.getItem("adminToken");
  const excelImportRef = useRef<HTMLInputElement>(null);

  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    fabric: "",
    occasion: "",
    pattern: "",
    workType: "",
    blousePiece: false,
    sareeLength: "",
    isNew: false,
    isTrending: false,
    isBestseller: false,
    onSale: false,
    fabricComposition: "",
    dimensions: "",
    weight: "",
    careInstructions: "",
    countryOfOrigin: ""
  });


  const importExcelMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory"] });
      toast({ 
        title: "Import successful!", 
        description: data.message 
      });
      if (excelImportRef.current) {
        excelImportRef.current.value = '';
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Import failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importExcelMutation.mutate(file);
    }
  };

  const handleExcelExport = async () => {
    try {
      const response = await fetch('/api/admin/products/export', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: "Products exported successfully!" });
    } catch (error: any) {
      toast({ 
        title: "Export failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const addProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/products", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory"] });
      toast({ title: "Product added successfully!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subcategory: "",
      fabric: "",
      occasion: "",
      pattern: "",
      workType: "",
      blousePiece: false,
      sareeLength: "",
      isNew: false,
      isTrending: false,
      isBestseller: false,
      onSale: false,
      fabricComposition: "",
      dimensions: "",
      weight: "",
      careInstructions: "",
      countryOfOrigin: ""
    });
    setColorVariants([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (colorVariants.length === 0) {
      toast({ 
        title: "At least one color variant required", 
        description: "Please add at least one color with images",
        variant: "destructive" 
      });
      return;
    }

    const hasImages = colorVariants.some(variant => variant.images && variant.images.length > 0);
    
    if ((productForm.isNew || productForm.isTrending) && !hasImages) {
      toast({
        title: "Images required for New/Trending products",
        description: "Please add at least one image before marking a product as New Arrival or Trending",
        variant: "destructive"
      });
      return;
    }

    const totalStock = colorVariants.reduce((sum, variant) => sum + (variant.stockQuantity ?? 0), 0);
    const anyInStock = colorVariants.some(variant => {
      const stock = variant.stockQuantity ?? 0;
      const isInStock = variant.inStock ?? true;
      return isInStock && stock > 0;
    });

    const formattedData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      category: productForm.category,
      subcategory: productForm.subcategory || undefined,
      fabric: productForm.fabric || undefined,
      colorVariants: colorVariants,
      occasion: productForm.occasion || undefined,
      pattern: productForm.pattern || undefined,
      workType: productForm.workType || undefined,
      blousePiece: productForm.blousePiece,
      sareeLength: productForm.sareeLength || undefined,
      stockQuantity: totalStock,
      inStock: anyInStock,
      isNew: productForm.isNew,
      isTrending: productForm.isTrending,
      isBestseller: productForm.isBestseller,
      onSale: productForm.onSale,
      specifications: {
        fabricComposition: productForm.fabricComposition || undefined,
        dimensions: productForm.dimensions || undefined,
        weight: productForm.weight || undefined,
        careInstructions: productForm.careInstructions || undefined,
        countryOfOrigin: productForm.countryOfOrigin || undefined,
      }
    };

    addProductMutation.mutate(formattedData);
  };

  if (!adminToken) {
    setLocation("/login");
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Product Management</h1>
          <div className="flex gap-2 flex-wrap">
            <input
              ref={excelImportRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleExcelImport}
              data-testid="input-excel-import-hidden"
            />
            <Button
              variant="outline"
              onClick={() => excelImportRef.current?.click()}
              disabled={importExcelMutation.isPending}
              data-testid="button-import-excel"
            >
              <FileUp className="mr-2 h-4 w-4" />
              {importExcelMutation.isPending ? "Importing..." : "Import Excel"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExcelExport}
              data-testid="button-export-excel"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-form-title">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ColorVariantEditor
                variants={colorVariants}
                onChange={setColorVariants}
                availableColors={AVAILABLE_COLORS}
                adminToken={adminToken}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" data-testid="label-product-name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                    data-testid="input-product-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" data-testid="label-category">Category *</Label>
                  <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jamdani Paithani" data-testid="option-jamdani-paithani">Jamdani Paithani</SelectItem>
                      <SelectItem value="Khun Irkal" data-testid="option-khun-irkal">Khun / Irkal (Ilkal)</SelectItem>
                      <SelectItem value="Ajrakh Modal" data-testid="option-ajrakh-modal">Ajrakh Modal</SelectItem>
                      <SelectItem value="Mul Mul Cotton" data-testid="option-mul-mul-cotton">Mul Mul Cotton</SelectItem>
                      <SelectItem value="Khadi Cotton" data-testid="option-khadi-cotton">Khadi Cotton</SelectItem>
                      <SelectItem value="Patch Work" data-testid="option-patch-work">Patch Work</SelectItem>
                      <SelectItem value="Pure Linen" data-testid="option-pure-linen">Pure Linen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" data-testid="label-description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={3}
                  data-testid="input-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" data-testid="label-price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                    data-testid="input-price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice" data-testid="label-original-price">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                    data-testid="input-original-price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fabric" data-testid="label-fabric">Fabric</Label>
                  <Input
                    id="fabric"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({...productForm, fabric: e.target.value})}
                    data-testid="input-fabric"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occasion" data-testid="label-occasion">Occasion</Label>
                  <Input
                    id="occasion"
                    value={productForm.occasion}
                    onChange={(e) => setProductForm({...productForm, occasion: e.target.value})}
                    data-testid="input-occasion"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pattern" data-testid="label-pattern">Pattern</Label>
                  <Input
                    id="pattern"
                    value={productForm.pattern}
                    onChange={(e) => setProductForm({...productForm, pattern: e.target.value})}
                    data-testid="input-pattern"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workType" data-testid="label-work-type">Work Type</Label>
                  <Input
                    id="workType"
                    value={productForm.workType}
                    onChange={(e) => setProductForm({...productForm, workType: e.target.value})}
                    data-testid="input-work-type"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sareeLength" data-testid="label-saree-length">Saree Length</Label>
                  <Input
                    id="sareeLength"
                    value={productForm.sareeLength}
                    onChange={(e) => setProductForm({...productForm, sareeLength: e.target.value})}
                    data-testid="input-saree-length"
                  />
                </div>
              </div>

              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="blousePiece"
                    checked={productForm.blousePiece}
                    onCheckedChange={(checked) => setProductForm({...productForm, blousePiece: checked as boolean})}
                    data-testid="checkbox-blouse-piece"
                  />
                  <Label htmlFor="blousePiece" data-testid="label-blouse-piece">Blouse Piece</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isNew"
                    checked={productForm.isNew}
                    onCheckedChange={(checked) => setProductForm({...productForm, isNew: checked as boolean})}
                    data-testid="checkbox-is-new"
                  />
                  <Label htmlFor="isNew" data-testid="label-is-new">New Arrival</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isTrending"
                    checked={productForm.isTrending}
                    onCheckedChange={(checked) => setProductForm({...productForm, isTrending: checked as boolean})}
                    data-testid="checkbox-is-trending"
                  />
                  <Label htmlFor="isTrending" data-testid="label-is-trending">Trending</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isBestseller"
                    checked={productForm.isBestseller}
                    onCheckedChange={(checked) => setProductForm({...productForm, isBestseller: checked as boolean})}
                    data-testid="checkbox-is-bestseller"
                  />
                  <Label htmlFor="isBestseller" data-testid="label-is-bestseller">Bestseller</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="onSale"
                    checked={productForm.onSale}
                    onCheckedChange={(checked) => setProductForm({...productForm, onSale: checked as boolean})}
                    data-testid="checkbox-on-sale"
                  />
                  <Label htmlFor="onSale" data-testid="label-on-sale">On Sale</Label>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-sm">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fabricComposition" data-testid="label-fabric-composition">Fabric Composition</Label>
                    <Input
                      id="fabricComposition"
                      value={productForm.fabricComposition}
                      onChange={(e) => setProductForm({...productForm, fabricComposition: e.target.value})}
                      placeholder="e.g., 100% Cotton Silk"
                      data-testid="input-fabric-composition"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensions" data-testid="label-dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={productForm.dimensions}
                      onChange={(e) => setProductForm({...productForm, dimensions: e.target.value})}
                      placeholder="e.g., 6 meters x 1.2 meters"
                      data-testid="input-dimensions"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight" data-testid="label-weight">Weight</Label>
                    <Input
                      id="weight"
                      value={productForm.weight}
                      onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
                      placeholder="e.g., 380g"
                      data-testid="input-weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryOfOrigin" data-testid="label-country-of-origin">Country of Origin</Label>
                    <Input
                      id="countryOfOrigin"
                      value={productForm.countryOfOrigin}
                      onChange={(e) => setProductForm({...productForm, countryOfOrigin: e.target.value})}
                      placeholder="e.g., India"
                      data-testid="input-country-of-origin"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="careInstructions" data-testid="label-care-instructions">Care Instructions</Label>
                    <Textarea
                      id="careInstructions"
                      value={productForm.careInstructions}
                      onChange={(e) => setProductForm({...productForm, careInstructions: e.target.value})}
                      placeholder="e.g., Dry clean recommended"
                      rows={2}
                      data-testid="input-care-instructions"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-reset">
                  Reset Form
                </Button>
                <Button type="submit" disabled={addProductMutation.isPending} data-testid="button-submit">
                  {addProductMutation.isPending ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
