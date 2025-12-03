# How to Apply the Modifications

Follow these steps carefully to apply all the new features:

## Step 1: Stop the Development Server

If your development server is running, stop it by pressing `Ctrl+C` in the terminal.

## Step 2: Update Existing Users (IMPORTANT!)

Run this command to mark all existing users as approved:

```bash
node update-users-approval.js
```

You should see: `Updated X users`

## Step 3: Regenerate Prisma Client

Try running this command. If it fails due to file lock, proceed to Step 4:

```bash
npx prisma generate
```

## Step 4: If Prisma Generate Fails

If you get an "EPERM: operation not permitted" error:

1. Close any running Node processes
2. Close your IDE/editor temporarily
3. Run the command again:
   ```bash
   npx prisma generate
   ```
4. Reopen your IDE

## Step 5: Start the Development Server

```bash
npm run dev
```

## Step 6: Test the New Features

### Test 1: Landing Page
1. Open your browser to `http://localhost:3000`
2. You should see the new landing page (not the login page)
3. Click "Sign Up" button

### Test 2: Registration with Approval
1. Fill in the registration form with:
   - Name
   - Company Name (new field!)
   - Phone Number (new field!)
   - Email
   - Password
2. Submit the form
3. You should see: "Registration successful! Please wait for admin approval."
4. Try to login with those credentials - should be blocked with approval message

### Test 3: Approve New User
1. Login as super admin (superadmin@example.com / password123)
2. Go to "Manage Users" in the sidebar
3. You should see the new user with "Pending" status
4. Click "Approve" button
5. Now the new user can login!

### Test 4: Notification Badges
1. While logged in, check the sidebar
2. You should see red badges with numbers on "Messages" and "Orders" (if there are any new items)

### Test 5: Create Advertisement
1. Login as admin or super admin
2. Go to "Advertisements" page
3. Click "Create Advertisement" button
4. Select a product and write a message
5. Submit
6. Login as a regular user - they should see max 5 ads

### Test 6: Admin Order Payment Verification
1. Login as admin (admin@example.com / password123)
2. Go to "Products" and place an order
3. Go to "Orders" and upload payment proof for your order
4. Login as super admin (or another admin if you create one)
5. Check notifications - should see payment upload notification
6. Go to "Orders" - should be able to verify the admin's payment

### Test 7: Profile Update (All Roles)
1. Login as super admin
2. Go to "My Profile"
3. Click "Edit Profile"
4. Update any field (name, phone, address, organization, picture)
5. Click "Save Changes"
6. Changes should be saved successfully
7. Repeat for admin and user roles

## Troubleshooting

### Issue: "EPERM: operation not permitted"
**Solution:** 
- Make sure no development server is running
- Close your IDE
- Delete the `.next` folder: `rmdir /s /q .next`
- Run `npx prisma generate` again

### Issue: "isApproved field not found"
**Solution:**
- The migration was applied but Prisma client wasn't regenerated
- Follow Step 4 above carefully

### Issue: Landing page not showing
**Solution:**
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Issue: Existing users can't login
**Solution:**
- You forgot to run Step 2
- Run: `node update-users-approval.js`

## What's New - Quick Summary

1. **Landing Page**: Beautiful homepage with sign up/sign in buttons
2. **Registration**: Now requires phone number and company name
3. **Approval System**: New users need super admin approval before login
4. **Notification Badges**: Red badges on sidebar showing unread messages and pending orders
5. **Advertisement Management**: Admins can create ads, users see limited number
6. **Extended Payment Verification**: Works between all roles (admin-to-admin, admin-to-superadmin, etc.)
7. **Profile Fix**: All roles can now update their profiles including organization name

## Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Make sure all steps were followed in order
3. Try restarting the development server
4. Check that the database migration was applied: `npx prisma migrate status`

Enjoy your enhanced Eco Green platform! 🌿
