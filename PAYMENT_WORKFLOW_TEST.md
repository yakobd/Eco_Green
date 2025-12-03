# Payment Workflow Test Guide

## The "💳 Finish Order" Button is Already Implemented!

The payment upload functionality is already built into your orders page. Here's how to test it:

## Step-by-Step Test

### Step 1: User Places Order
1. Login as a **USER** (not admin)
2. Go to **Products** page
3. Click "Order Now" on any product
4. Enter quantity and submit
5. Order status will be: **PENDING**

### Step 2: Admin Confirms Order
1. Logout and login as **ADMIN** or **SUPER_ADMIN**
2. Go to **Orders** page
3. Find the pending order
4. Click **"✓ Confirm"** button
5. Order status changes to: **APPROVED**
6. Delivery status changes to: **PENDING_PAYMENT**

### Step 3: User Uploads Payment (THIS IS THE KEY STEP!)
1. Logout and login back as the **USER**
2. Go to **Orders** page
3. You should now see a **"💳 Finish Order"** button on the approved order
4. Click the **"💳 Finish Order"** button
5. A modal will appear showing:
   - Order details
   - **Company Bank Account Information:**
     - Bank: Commercial Bank of Ethiopia (CBE)
     - Account Number: **1000420841632**
     - Account Name: **Yakob Dereje Negash**
   - File upload field for payment proof
6. Click "Choose File" and upload a screenshot/receipt
7. Click **"Submit Payment"**
8. The payment proof is now attached to the order

### Step 4: Admin Verifies Payment
1. Login as **ADMIN**
2. Go to **Orders** page
3. Find the order with uploaded payment
4. Click **"🔍 Verify Payment"** button
5. View the uploaded screenshot
6. Click **"✓ Approve Payment"** or **"✗ Reject Payment"**
7. If approved:
   - Delivery status: **DELIVERY_IN_PROGRESS**
   - User gets notification

### Step 5: Admin Marks Delivered
1. When order is delivered, click **"✓ Mark Delivered"**
2. Order status: **DELIVERED**
3. Stock quantity automatically reduced
4. User gets notification

## Troubleshooting

### "💳 Finish Order" Button Not Showing?

Check these conditions:
1. ✅ Are you logged in as a **USER** (not admin)?
2. ✅ Is the order status **APPROVED**?
3. ✅ Have you NOT already uploaded payment proof?

If all three are true and button still doesn't show:
1. Refresh the page (Ctrl+F5)
2. Check browser console for errors
3. Verify the order in the database has `status = 'APPROVED'`

### Payment Modal Features

The payment modal includes:
- ✅ Order summary (ID, product, amount)
- ✅ Company bank account details in a highlighted box
- ✅ File upload with image preview
- ✅ Submit and Cancel buttons
- ✅ Dark mode support

### After Payment Upload

User will see:
- ✅ "Payment under review" text instead of button
- ✅ Cannot upload again until admin rejects

Admin will see:
- ✅ "🔍 Verify Payment" button
- ✅ Can view uploaded screenshot
- ✅ Can approve or reject

## Database Fields

The Order model has these fields for payment workflow:
```prisma
model Order {
  paymentProof    String?   // Base64 encoded image
  paymentVerified Boolean   @default(false)
  deliveryStatus  String    @default("NOT_SHIPPED")
  // ... other fields
}
```

## Complete Workflow Summary

```
1. USER places order → PENDING
2. ADMIN confirms → APPROVED + PENDING_PAYMENT
3. USER clicks "💳 Finish Order" → Uploads payment proof
4. ADMIN clicks "🔍 Verify Payment" → Approves
5. Order status → DELIVERY_IN_PROGRESS
6. ADMIN clicks "✓ Mark Delivered" → DELIVERED
7. Stock reduced automatically
```

## The Feature is Already There!

You don't need to add anything - the payment upload functionality with screenshot/receipt attachment is already fully implemented in your orders page. Just follow the test steps above to see it in action!
