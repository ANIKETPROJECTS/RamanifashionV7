interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
}

interface LocalCart {
  items: CartItem[];
}

interface WishlistItem {
  productId: string;
  selectedColor: string | null;
}

interface LocalWishlist {
  products: WishlistItem[];
}

export const localStorageService = {
  getCart(): LocalCart {
    try {
      const cart = localStorage.getItem('guest_cart');
      return cart ? JSON.parse(cart) : { items: [] };
    } catch {
      return { items: [] };
    }
  },

  setCart(cart: LocalCart): void {
    localStorage.setItem('guest_cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  addToCart(productId: string, quantity: number = 1, selectedColor?: string): void {
    const baseProductId = productId.includes('_variant_') 
      ? productId.split('_variant_')[0] 
      : productId;
    
    console.log('➕ addToCart called with:', { originalProductId: productId, baseProductId, quantity, selectedColor });
    
    const cart = this.getCart();
    const existingItem = cart.items.find(
      item => {
        const productMatch = item.productId === baseProductId;
        const colorMatch = (item.selectedColor || undefined) === (selectedColor || undefined);
        return productMatch && colorMatch;
      }
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
      console.log('✅ Updated existing cart item:', existingItem);
    } else {
      cart.items.push({ productId: baseProductId, quantity, selectedColor });
      console.log('✅ Added new cart item');
    }
    
    this.setCart(cart);
  },

  updateCartQuantity(productId: string, quantity: number, selectedColor?: string): void {
    console.log('🔧 updateCartQuantity called with:', { productId, quantity, selectedColor });
    const cart = this.getCart();
    console.log('📦 Current cart items:', cart.items);
    
    const item = cart.items.find(
      item => {
        const productMatch = item.productId === productId;
        const colorMatch = (item.selectedColor || undefined) === (selectedColor || undefined);
        console.log('🔍 Checking item:', { 
          itemProductId: item.productId, 
          itemColor: item.selectedColor,
          productMatch,
          colorMatch
        });
        return productMatch && colorMatch;
      }
    );
    
    console.log('✅ Found item:', item);
    if (item) {
      item.quantity = quantity;
      this.setCart(cart);
      console.log('💾 Cart updated successfully');
    } else {
      console.error('❌ Item not found in cart!');
    }
  },

  removeFromCart(productId: string, selectedColor?: string): void {
    console.log('🗑️ removeFromCart called with:', { productId, selectedColor });
    const cart = this.getCart();
    console.log('📦 Current cart items before removal:', cart.items);
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => {
        const productMatch = item.productId === productId;
        const colorMatch = (item.selectedColor || undefined) === (selectedColor || undefined);
        const shouldRemove = productMatch && colorMatch;
        console.log('🔍 Checking item for removal:', { 
          itemProductId: item.productId, 
          itemColor: item.selectedColor,
          productMatch,
          colorMatch,
          shouldRemove,
          keepItem: !shouldRemove
        });
        return !shouldRemove;
      }
    );
    
    console.log('📦 Cart items after filter:', cart.items);
    console.log(`📊 Removed ${initialLength - cart.items.length} items`);
    this.setCart(cart);
  },

  clearCart(): void {
    localStorage.removeItem('guest_cart');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  getWishlist(): LocalWishlist {
    try {
      const wishlist = localStorage.getItem('guest_wishlist');
      if (!wishlist) return { products: [] };
      const parsed = JSON.parse(wishlist);
      // Handle old format where products was an array of strings
      if (Array.isArray(parsed.products) && parsed.products.length > 0 && typeof parsed.products[0] === 'string') {
        return { products: parsed.products.map((id: string) => ({ productId: id, selectedColor: null })) };
      }
      return parsed;
    } catch {
      return { products: [] };
    }
  },

  setWishlist(wishlist: LocalWishlist): void {
    localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  },

  addToWishlist(productId: string, selectedColor?: string | null): void {
    const baseProductId = productId.includes('_variant_')
      ? productId.split('_variant_')[0]
      : productId;
    const color = selectedColor || null;
    const wishlist = this.getWishlist();
    const exists = wishlist.products.some(
      item => item.productId === baseProductId && item.selectedColor === color
    );
    if (!exists) {
      wishlist.products.push({ productId: baseProductId, selectedColor: color });
      this.setWishlist(wishlist);
    }
  },

  removeFromWishlist(productId: string, selectedColor?: string | null): void {
    const color = selectedColor !== undefined ? selectedColor : null;
    const wishlist = this.getWishlist();
    wishlist.products = wishlist.products.filter(
      item => !(item.productId === productId && item.selectedColor === color)
    );
    this.setWishlist(wishlist);
  },

  isInWishlist(productId: string, selectedColor?: string | null): boolean {
    const wishlist = this.getWishlist();
    const color = selectedColor !== undefined ? selectedColor : null;
    return wishlist.products.some(
      item => item.productId === productId && item.selectedColor === color
    );
  },

  clearWishlist(): void {
    localStorage.removeItem('guest_wishlist');
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  }
};
