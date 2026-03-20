# Design Guidelines for Ramani Fashion India E-Commerce Website

## Design Theme & Aesthetics

### Color Palette
- **Primary Colors:** Soft pink (#FFB6C1, #FFC0CB, #FF69B4) with elegant gradients
- **Secondary:** Pure white (#FFFFFF, #FAFAFA) for clean backgrounds
- **Accent:** Rose gold (#B76E79) for premium touches
- **Text:** Deep charcoal (#2C2C2C) for readability
- **Borders/Dividers:** Light grey (#E5E5E5)

### Visual Style
- Elegant, sophisticated, and feminine aesthetic with modern luxury feel
- High-quality, large product images with zoom functionality
- Soft shadows and rounded corners for premium look
- Ample white space for breathability
- Subtle animations on hover and scroll
- Professional fashion photography presentation
- Gradient overlays on hero sections
- Ornate Indian-inspired decorative elements (paisley patterns, mandala motifs) used sparingly

## Typography
- Logo: Elegant script font
- Headings: Clean, modern serif or sophisticated sans-serif
- Body text: Readable sans-serif for optimal legibility
- Maintain clear hierarchy between heading levels

## Layout System
- Use Tailwind spacing units: 2, 4, 8, 12, 16, 20, 24, 32 for consistency
- Generous padding and margins throughout
- Maximum container widths: max-w-7xl for full sections, max-w-6xl for content

## Navigation Structure

### Header (Sticky)
- Logo positioned left with elegant styling
- Center search bar with autocomplete
- Right side: Account icon, Wishlist counter with badge, Cart icon with item count
- Main navigation: Home | New Arrivals | Categories | Occasions | Collections | Sale | About Us
- Top banner: "Free shipping on orders above ₹999 | Easy Returns | Customer Support"

### Mobile Navigation
- Hamburger menu for main navigation
- Bottom navigation bar: Home, Categories, Search, Wishlist, Account icons

## Homepage Components

### Hero Section
- Full-width carousel (3-5 slides) with high-resolution saree imagery
- Models wearing sarees in lifestyle settings
- Overlay text with promotional messaging
- "Shop Now" CTA buttons with hover effects
- Auto-transition with manual navigation controls

### Category Quick Access
- Grid of 8-10 circular or elegant rectangular cards
- Categories include: Silk, Cotton, Designer, Bridal, Party Wear, Casual, Banarasi, Kanjeevaram
- Representative images with category names
- Hover effects revealing item counts

### Featured Collections
- "New Arrivals" - horizontal scrollable row
- "Bestsellers" - responsive grid
- "Editor's Pick" - curated selection
- Each section with "View All" button

### Occasion-Based Shopping
- Cards for: Weddings, Festivals, Party, Office Wear, Daily Wear
- Beautiful representative imagery
- Direct filtering links

### Trust Indicators
- Three-column layout:
  - Free Shipping & Easy Returns
  - 100% Authentic Handloom
  - Secure Payment Options
- Icons with supporting descriptions

### Customer Testimonials
- Carousel format with star ratings
- Customer photos if available
- Purchase verification badges

### Instagram Feed
- Grid layout of latest posts
- "#OurSareeStory" hashtag display
- Follow CTA

### Footer
- Four-column layout: About Us, Customer Service, Quick Links, Contact Info
- Newsletter subscription
- Social media icons
- Payment method icons
- Policy links

## Product Listing Page

### Layout
- Left sidebar filters (30% width, collapsible)
- Right product grid (70% width, 3-4 columns)
- Breadcrumb navigation
- Results count and sort dropdown

### Filter Categories
Price range slider, Fabric type, Color palette selector, Occasion, Work/Embellishment, Pattern, Border type, Saree length, Blouse piece, Discount levels, Customer ratings, Availability, Brand/Designer
- "Clear All Filters" button

### Product Cards
- Primary image with hover-reveal secondary image
- Quick view icon, Wishlist heart (top right)
- Product name, Price (strikethrough original + discounted), Discount badge
- Star rating with review count
- "New" or "Bestseller" badges
- Quick "Add to Cart" on hover

## Product Detail Page

### Image Gallery (50% left)
- Large main image with zoom capability
- 4-6 thumbnail gallery below
- Video thumbnail, 360° view option
- Share and Wishlist buttons

### Product Information (50% right)
- Prominent product title
- Star rating with review link
- Price display: strikethrough original, large discounted price, discount badge
- Tax information
- Quantity selector
- Primary CTAs: "Add to Cart" (solid pink), "Buy Now" (outlined), "Add to Wishlist"
- Delivery section: Pincode checker, estimated delivery, COD availability
- Offers section: Bank offers, coupon codes
- Product highlights in bullet points

### Tabbed Content Sections
1. Description: Detailed info, styling tips, draping recommendations
2. Specifications: Fabric, dimensions, care instructions, SKU
3. Reviews & Ratings: Star breakdown, customer reviews with images, helpful voting
4. Shipping & Returns: Policies and timelines

### Related Products
- "Complete the Look" suggestions
- "Similar Products" carousel
- "Frequently Bought Together"
- "Recently Viewed" section

## Shopping Cart

### Layout
- Left (70%): Cart items list
- Right (30%): Sticky order summary panel

### Cart Items
- Product thumbnail, name (linked), selected options
- Price per unit, quantity selector, subtotal
- Remove, Move to Wishlist, Save for Later buttons

### Order Summary
- Items count, subtotal, discount
- Coupon code input with "Apply" button
- Shipping charges, tax breakdown
- Grand total (prominent)
- "Proceed to Checkout" (large pink button)
- "Continue Shopping" link
- Trust badges

## Checkout Process

### Multi-Step Progress
Step indicators: Login/Register → Address → Payment → Review Order

### Steps
1. Authentication: Login form, new customer registration, guest checkout, social login
2. Delivery Address: Saved addresses as cards, add new address form
3. Payment: Expandable options (Card, UPI, Net Banking, Wallets, COD, EMI)
4. Order Review: Complete summary with "Place Order" button

### Sidebar (All Steps)
- Persistent order summary
- Price breakdown
- Product thumbnails

## User Account Dashboard

### Sidebar Navigation
My Profile, My Orders, Wishlist, Saved Addresses, Payment Methods, Notifications, Coupons & Offers

### Key Sections
- **My Orders:** Filter tabs, order cards with status tracker, actions (cancel, return, invoice)
- **Wishlist:** Grid with move to cart, price drop alerts
- **Profile:** Personal info, profile picture, password change, preferences

## Images

### Homepage
- **Hero Carousel:** 5 full-width lifestyle images showing models wearing elegant sarees in various settings (weddings, parties, traditional occasions)
- **Category Cards:** 10 representative images for each saree category
- **Featured Collections:** Product images for 12-15 sarees across collections
- **Occasion Cards:** 5 aspirational lifestyle images
- **Testimonials:** Customer photos (if available)
- **Instagram Grid:** 6-8 recent posts

### Product Pages
- Multiple high-resolution product images from various angles
- Close-up detail shots of fabric, embroidery, and borders
- Draping/styling reference images
- Customer-uploaded photos in reviews

### Other Pages
- About Us: Brand story images, team photos, craftsmanship showcase
- Blog: Featured images for articles
- Contact: Store location images

## Responsive Design
- Desktop: Full multi-column layouts
- Tablet (md:): 2-column grids, collapsible filters
- Mobile (base): Single column, hamburger menu, bottom navigation bar, touch-optimized elements