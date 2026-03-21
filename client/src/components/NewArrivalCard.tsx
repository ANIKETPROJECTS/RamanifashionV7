import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { localStorageService } from "@/lib/localStorage";
import placeholderImage from "@assets/stock_images/elegant_saree_produc_6a8286b5.jpg";

interface NewArrivalCardProps {
  id: string;
  name: string;
  image: string;
  secondaryImage?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  onClick?: () => void;
  baseProductId?: string;
  displayColor?: string;
}

export default function NewArrivalCard({
  id,
  name,
  image,
  secondaryImage,
  price,
  originalPrice,
  discount,
  rating = 0,
  reviewCount = 0,
  onClick,
  baseProductId,
  displayColor,
}: NewArrivalCardProps) {
  const [, setLocation] = useLocation();
  const [currentImage, setCurrentImage] = useState(image);
  const { toast } = useToast();

  const cartProductId = baseProductId || id.split('_variant_')[0];
  const token = localStorage.getItem("token");

  const { data: wishlistData } = useQuery<any>({
    queryKey: ["/api/wishlist"],
    enabled: !!token,
    retry: false,
  });

  const isInApiWishlist = !!wishlistData?.products?.some((item: any) => {
    const idMatch = item._id?.toString() === cartProductId || item._id === cartProductId;
    if (!idMatch) return false;
    if (displayColor) return item.selectedColor === displayColor;
    return true;
  });
  const isInLocalWishlist = !token && localStorageService.isInWishlist(cartProductId, displayColor || null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (token) {
      setIsWishlisted(isInApiWishlist);
    } else {
      setIsWishlisted(isInLocalWishlist);
    }
  }, [isInApiWishlist, isInLocalWishlist, token]);

  const addToCartMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/cart", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({ title: "Added to cart successfully!" });
    },
    onError: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorageService.addToCart(cartProductId, 1, displayColor);
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        toast({ title: "Added to cart successfully!" });
      } else {
        toast({ title: "Failed to add to cart", variant: "destructive" });
      }
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) =>
      apiRequest(`/api/wishlist/${productId}`, "POST", { selectedColor: displayColor || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({ title: "Added to wishlist!" });
    },
    onError: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorageService.addToWishlist(cartProductId, displayColor || null);
        queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
        toast({ title: "Added to wishlist!" });
      } else {
        toast({ title: "Failed to add to wishlist", variant: "destructive" });
      }
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) =>
      apiRequest(`/api/wishlist/${productId}`, "DELETE", { selectedColor: displayColor || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({ title: "Removed from wishlist!" });
    },
    onError: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorageService.removeFromWishlist(cartProductId, displayColor || null);
        queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
        toast({ title: "Removed from wishlist!" });
      } else {
        toast({ title: "Failed to remove from wishlist", variant: "destructive" });
      }
    },
  });

  const buyNowMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/cart", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setLocation("/checkout");
    },
    onError: () => {
      toast({ title: "Failed to proceed with Buy Now", variant: "destructive" });
    },
  });

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(cartProductId);
    } else {
      addToWishlistMutation.mutate(cartProductId);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartMutation.mutate({ 
      productId: cartProductId, 
      quantity: 1,
      selectedColor: displayColor 
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    buyNowMutation.mutate({ 
      productId: cartProductId, 
      quantity: 1,
      selectedColor: displayColor 
    });
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group w-full flex flex-col"
      onClick={() => onClick ? onClick() : setLocation(`/product/${id}`)}
      data-testid={`card-new-arrival-${id}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={currentImage || placeholderImage}
          alt={name}
          className="w-full h-full object-cover"
          onMouseEnter={() => secondaryImage && setCurrentImage(secondaryImage)}
          onMouseLeave={() => setCurrentImage(image)}
        />
        
        <div className={`absolute top-2 right-2 z-20 rounded-full p-1.5 flex items-center justify-center ${isWishlisted ? 'bg-destructive' : 'bg-white'}`}>
          <button
            onClick={handleWishlist}
            data-testid={`button-wishlist-${id}`}
            className="focus:outline-none"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-white text-white' : 'text-black'}`} />
          </button>
        </div>
        
        <Badge 
          className="absolute top-2 left-2 rounded-full bg-amber-800 text-white px-3 py-1 text-xs font-medium"
          data-testid={`badge-new-${id}`}
        >
          NEW
        </Badge>


        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
          <Button 
            className="w-full bg-primary hover:bg-primary text-primary-foreground"
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${id}`}
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            className="w-full"
            variant="secondary"
            onClick={handleBuyNow}
            data-testid={`button-buy-now-${id}`}
            size="sm"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>

      <CardContent className="p-3 flex flex-col flex-1">
        <h3 className="font-medium text-sm line-clamp-2 mb-1" data-testid={`text-product-name-${id}`}>
          {name}
        </h3>

        {displayColor && (
          <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mb-1 w-fit" data-testid={`text-color-${id}`}>
            {displayColor}
          </span>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className="text-lg font-bold text-black" data-testid={`text-price-${id}`}>
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <>
              <span className="text-sm text-black line-through" data-testid={`text-original-price-${id}`}>
                ₹{originalPrice.toLocaleString()}
              </span>
              {discount !== undefined && discount > 0 && (
                <span className="text-xs text-black font-medium" data-testid={`text-discount-${id}`}>
                  {discount}% off
                </span>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
