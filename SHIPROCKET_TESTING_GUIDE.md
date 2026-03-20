# Shiprocket Testing Guide

## What Shiprocket Does in Your Application

**Shiprocket is your automated shipping partner** that handles the entire delivery process.

### The Flow:
1. **Customer orders** → Pays via PhonePe → Order created in your database
2. **You approve order** (as admin) → Your app sends details to Shiprocket
3. **Shiprocket automatically**:
   - Finds the best courier company (BlueDart, Delhivery, etc.)
   - Generates AWB tracking number
   - Schedules pickup from your location
   - Creates shipping label for you to print
   - Tracks package until delivery

**In simple words**: You just pack the item and hand it to the courier. Shiprocket handles everything else!

---

## Important: No Sandbox Environment

⚠️ **Unlike PhonePe, Shiprocket does NOT have a test/sandbox mode.**

You test with real orders, then cancel them for full refunds.

---

## How to Test Safely

### Step 1: Add Wallet Balance
1. Log in to [Shiprocket Dashboard](https://app.shiprocket.in)
2. Go to **Settings** → **Recharge Wallet**
3. Add ₹200 (enough for 5-10 test shipments)

### Step 2: Create Test Order in Your App
1. Log in to your admin panel
2. Wait for a test order (or create one yourself)
3. Ensure payment is marked as "paid"
4. Click **Approve Order**

### Step 3: Verify in Shiprocket
1. Go to Shiprocket Dashboard → **Orders**
2. You should see your test order appear
3. Check that AWB number is generated
4. Verify courier is assigned

### Step 4: Cancel Test Order (Get Refund)
1. In Shiprocket Dashboard → **Orders**
2. Find your test order
3. Click **Cancel Shipment**
4. Money returns to your wallet immediately ✅

---

## What Gets Tested

When you approve an order, your app tests:
- ✅ API authentication with Shiprocket
- ✅ Order creation with customer details
- ✅ AWB (tracking number) generation
- ✅ Courier assignment
- ✅ Pickup scheduling
- ✅ Error handling if something fails

---

## Testing Best Practices

### Use Real Indian Addresses
Use valid pin codes for testing:
- **Mumbai**: 400001
- **Delhi**: 110001
- **Bangalore**: 560001
- **Pune**: 411001

### Test Order Details
- **Weight**: Use realistic weights (0.5 kg - 2 kg for sarees)
- **Dimensions**: L: 30cm, B: 25cm, H: 10cm (default in your code)
- **Phone**: Use valid 10-digit numbers
- **Email**: Use real email addresses

### Cancel Quickly
- Cancel test orders within 24 hours
- This prevents actual pickup attempts
- You get 100% refund immediately

---

## Common Test Scenarios

### Scenario 1: Prepaid Order (Recommended for Testing)
1. Create order with payment method: "Prepaid"
2. Mark payment as completed
3. Approve order
4. Shiprocket creates shipment
5. Cancel immediately

### Scenario 2: COD Order
1. Create order with payment method: "COD"
2. Approve order (no payment needed)
3. Shiprocket creates shipment
4. Cancel before pickup

### Scenario 3: Error Handling
1. Try approving order with invalid pin code
2. System should show error message
3. Order should remain in "pending" state

---

## Monitoring Your Tests

### In Your Admin Panel
- Check order status changes: `pending` → `processing`
- Verify Shiprocket Order ID appears
- Verify AWB code is saved

### In Shiprocket Dashboard
- **Orders Tab**: See all created orders
- **Shipments Tab**: Track shipment status
- **Reports Tab**: Check API calls and charges
- **Wallet Tab**: Monitor balance and refunds

---

## Cost Breakdown

Each test order costs approximately:
- **Within city**: ₹30-40
- **Same state**: ₹40-60
- **Different state**: ₹60-100

**But you get 100% refund when cancelled!**

---

## Troubleshooting

### "Authentication Failed"
- Check `.env` file has correct `SHIPROCKET_API_EMAIL` and `SHIPROCKET_API_PASSWORD`
- Verify these are API user credentials (not main account login)

### "Pickup Location Not Found"
- Go to Shiprocket → Settings → Pickup Locations
- Create a pickup location named "Primary"
- Add your complete address with pin code

### "Order Creation Failed"
- Check all required fields are filled
- Verify pin code is valid Indian pin code
- Ensure phone number is 10 digits
- Check wallet has sufficient balance

### "AWB Assignment Failed"
- This can happen if courier unavailable for pin code
- Try with different delivery pin code
- Check if pickup location is verified

---

## Quick Testing Checklist

Before going live, test:
- [ ] Order creation (prepaid)
- [ ] Order creation (COD)
- [ ] AWB generation
- [ ] Courier assignment
- [ ] Order cancellation
- [ ] Error handling (invalid pin code)
- [ ] Refund received in wallet

---

## Going Live

Once testing is complete:
1. ✅ You're already live! No sandbox switch needed
2. Stop cancelling orders - let them ship
3. Monitor first few orders closely
4. Keep wallet balance sufficient for shipments
5. Regularly check Shiprocket dashboard

---

## Support

**Shiprocket Support**: 
- Email: care@shiprocket.in
- Dashboard: Help → Support Tickets
- Phone: Available in dashboard

**API Documentation**: https://apidocs.shiprocket.in/

---

**Remember**: Every cancelled test order gives you 100% refund, so test freely!
