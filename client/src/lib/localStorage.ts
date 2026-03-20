interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
}

interface LocalCart {
  items: CartItem[];
}

interface LocalWishlist {
  products: string[];
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
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  addToCart(productId: string, quantity: number = 1, selectedColor?: string): void {
    // Strip variant suffix if present (e.g., "id_variant_0" -> "id")
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
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  getWishlist(): LocalWishlist {
    try {
      const wishlist = localStorage.getItem('guest_wishlist');
      return wishlist ? JSON.parse(wishlist) : { products: [] };
    } catch {
      return { products: [] };
    }
  },

  setWishlist(wishlist: LocalWishlist): void {
    localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  },

  addToWishlist(productId: string): void {
    const wishlist = this.getWishlist();
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      this.setWishlist(wishlist);
    }
  },

  removeFromWishlist(productId: string): void {
    const wishlist = this.getWishlist();
    wishlist.products = wishlist.products.filter(id => id !== productId);
    this.setWishlist(wishlist);
  },

  isInWishlist(productId: string): boolean {
    const wishlist = this.getWishlist();
    return wishlist.products.includes(productId);
  },

  clearWishlist(): void {
    localStorage.removeItem('guest_wishlist');
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  }
};
