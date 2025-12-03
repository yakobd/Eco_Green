# Pending Users Badge Counter

## Feature Added ✅

### Badge Counter on "Manage Users" Menu Item

**What it does:**
- Shows a red badge with the count of pending user approvals
- Only visible to SUPER_ADMIN role
- Updates automatically every 30 seconds
- Updates immediately when a user is approved

---

## Implementation Details

### 1. Sidebar Badge
- Added `pendingUsers` state to track count
- Fetches count of users where `isApproved = false`
- Displays red badge next to "Manage Users" menu item
- Only fetches for SUPER_ADMIN role

### 2. Auto-Refresh
- Refreshes every 30 seconds automatically
- Also refreshes when custom event is triggered

### 3. Immediate Update on Approval
- When super admin approves a user, badge count decreases immediately
- Triggers `refreshSidebarCounts` event
- No need to wait 30 seconds for update

---

## How It Works

### Badge Display Logic
```
IF role === 'SUPER_ADMIN':
  - Fetch all users
  - Count users where isApproved === false
  - Display count in red badge
  - Badge only shows if count > 0
```

### Update Triggers
1. **Auto-refresh**: Every 30 seconds
2. **Manual trigger**: When user is approved
3. **Event-based**: Custom `refreshSidebarCounts` event

---

## User Flow

### New User Registration
1. User registers on landing page
2. Super admin receives notification
3. **Badge appears on "Manage Users" with count**
4. Badge shows number of pending approvals

### User Approval
1. Super admin goes to "Manage Users"
2. Clicks "Approve" on pending user
3. **Badge count decreases immediately**
4. If no more pending users, badge disappears

---

## Files Modified

1. `components/Sidebar.tsx`
   - Added `pendingUsers` state
   - Added fetch logic for pending users count
   - Added badge display for "Manage Users" link

2. `app/dashboard/users/page.tsx`
   - Added event trigger on user approval
   - Triggers sidebar refresh immediately

---

## Testing Checklist

### Initial State
- [ ] Login as super admin
- [ ] Check sidebar "Manage Users" menu item
- [ ] If there are pending users, should see red badge with count

### New Registration
- [ ] Log out
- [ ] Register a new user
- [ ] Login as super admin
- [ ] Badge count should increase (may take up to 30 seconds or refresh page)

### Approval Process
- [ ] Login as super admin
- [ ] Note the badge count on "Manage Users"
- [ ] Go to "Manage Users" page
- [ ] Click "Approve" on a pending user
- [ ] **Badge count should decrease immediately**
- [ ] If no more pending users, badge should disappear

### Multiple Pending Users
- [ ] Register 3 new users (log out and register each time)
- [ ] Login as super admin
- [ ] Badge should show "3"
- [ ] Approve one user → badge shows "2"
- [ ] Approve another → badge shows "1"
- [ ] Approve last one → badge disappears

---

## Visual Example

### Before Approval
```
Sidebar:
├─ Dashboard
├─ Products
├─ Orders
├─ Messages [2]
├─ Notifications [5]
├─ Manage Products
├─ Branches
├─ Manage Users [3]  ← Red badge showing 3 pending users
├─ Organization Analytics
└─ Reports
```

### After Approving One User
```
Sidebar:
├─ Dashboard
├─ Products
├─ Orders
├─ Messages [2]
├─ Notifications [5]
├─ Manage Products
├─ Branches
├─ Manage Users [2]  ← Badge now shows 2
├─ Organization Analytics
└─ Reports
```

### After Approving All Users
```
Sidebar:
├─ Dashboard
├─ Products
├─ Orders
├─ Messages [2]
├─ Notifications [5]
├─ Manage Products
├─ Branches
├─ Manage Users      ← No badge (all approved)
├─ Organization Analytics
└─ Reports
```

---

## Summary

The "Manage Users" menu item now has a badge counter that:
- ✅ Shows count of pending user approvals
- ✅ Only visible to super admin
- ✅ Updates automatically every 30 seconds
- ✅ Updates immediately when user is approved
- ✅ Disappears when no pending users
- ✅ Matches the style of other badges (Messages, Orders, Notifications)

This makes it easy for super admins to see at a glance how many users are waiting for approval! 🎉
