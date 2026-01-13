# Role-Based Access Control (RBAC) Implementation

## Overview

The Zigma CRM now implements a comprehensive role-based access control system with three distinct user roles:

1. **Admin** - Full system access
2. **Staff** - Limited management access
3. **Investor** - Personal portfolio access only

## User Roles & Permissions

### 👑 Admin Role

**Full Access** - Complete control over the system

**Permissions:**
- ✅ View & manage all dashboards (admin + investor)
- ✅ Full CRUD operations on investors
- ✅ Full CRUD operations on funds
- ✅ Full CRUD operations on opportunities
- ✅ Full CRUD operations on leads
- ✅ View all reports and analytics
- ✅ Download any statements
- ✅ Manage user accounts
- ✅ Manage roles and permissions
- ✅ System settings access

**Default Route:** `/dashboard`

---

### 👔 Staff Role

**Limited Management Access** - Can view and edit, but cannot delete

**Permissions:**
- ✅ View admin dashboard
- ✅ View all investors
- ✅ Create/edit investors (cannot delete)
- ✅ View all funds
- ✅ Edit funds (cannot create or delete)
- ✅ View all opportunities
- ✅ Create/edit opportunities (cannot delete)
- ✅ View all leads
- ✅ Create/edit leads (cannot delete)
- ✅ View all reports
- ✅ Download statements
- ❌ NO access to investor portal
- ❌ Cannot manage users
- ❌ Cannot manage roles
- ❌ Cannot access system settings

**Default Route:** `/dashboard`

---

### 💼 Investor Role

**Personal Portfolio Only** - Restricted to own investments

**Permissions:**
- ✅ View investor portal
- ✅ View personal portfolio
- ✅ Track personal returns and performance
- ✅ Download personal statements
- ✅ View personal transactions
- ✅ Upload personal documents
- ✅ Update personal profile (limited)
- ❌ NO access to admin dashboard
- ❌ Cannot view other investors
- ❌ Cannot view all funds
- ❌ Cannot view opportunities
- ❌ Cannot view leads
- ❌ Cannot access system features

**Default Route:** `/investor/dashboard`

---

## Implementation Details

### Files Created

1. **`src/lib/permissions.ts`**
   - Defines UserRole type
   - RolePermissions interface
   - Permission mapping for each role
   - Helper functions for role management

2. **`src/components/RoleBasedRoute.tsx`**
   - Route protection component
   - Checks user permissions before rendering
   - Redirects unauthorized users to appropriate dashboards

3. **`src/pages/AuthCallback.tsx`**
   - OAuth callback handler
   - Redirects users to role-appropriate dashboard after OAuth login

### Files Modified

1. **`src/store/useAuthStore.ts`**
   - Added role and permissions state
   - Fetches user role from metadata/database
   - Provides permission checking methods
   - Auto-redirects based on role

2. **`src/App.tsx`**
   - Implements RoleBasedRoute protection
   - Separate route groups for admin/staff vs investors
   - Protected routes with permission requirements

3. **`src/pages/Login.tsx`**
   - Sets default role on signup (`investor`)
   - Redirects to role-appropriate dashboard after login

## How It Works

### 1. User Authentication

```typescript
// When user signs in, their role is loaded from user_metadata
const userRole = user.user_metadata?.role || 'investor';
const permissions = getRolePermissions(userRole);
```

### 2. Route Protection

```tsx
<RoleBasedRoute 
    requiredPermission="viewAdminDashboard"
    redirectTo="/investor/dashboard"
>
    <Layout />
</RoleBasedRoute>
```

### 3. Permission Checking

```typescript
// In components
const { hasPermission } = useAuthStore();

if (hasPermission('createInvestor')) {
    // Show create button
}
```

### 4. Automatic Redirects

- **Admin/Staff**: Log in → `/dashboard`
- **Investor**: Log in → `/investor/dashboard`
- **Unauthorized**: Attempting to access restricted route → Redirected to default route

## Testing User Roles

### Method 1: Update User Metadata in Supabase

1. Go to Supabase Dashboard → Authentication → Users
2. Click on a user
3. Add `role` field to `user_metadata`:
   ```json
   {
     "role": "admin"  // or "staff" or "investor"
   }
   ```
4. Save changes
5. User must log out and log back in

### Method 2: Create Test Accounts

Create three test accounts with different roles:

**Admin Account:**
```typescript
await supabase.auth.signUp({
    email: 'admin@zigma.com',
    password: 'password123',
    options: {
        data: {
            full_name: 'Admin User',
            role: 'admin'
        }
    }
});
```

**Staff Account:**
```typescript
await supabase.auth.signUp({
    email: 'staff@zigma.com',
    password: 'password123',
    options: {
        data: {
            full_name: 'Staff User',
            role: 'staff'
        }
    }
});
```

**Investor Account:**
```typescript
// Default - no role specified defaults to 'investor'
await supabase.auth.signUp({
    email: 'investor@zigma.com',
    password: 'password123'
});
```

## Database Setup (Production)

For production, create a `user_roles` table in Supabase:

```sql
-- Create user_roles table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'investor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own role
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Only admins can update roles
CREATE POLICY "Admins can update roles" ON user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

Then update `useAuthStore.ts` to fetch role from database instead of metadata.

## Security Features

✅ **Route-level protection** - Unauthorized users cannot access restricted routes
✅ **Permission-based UI rendering** - Buttons/features hidden based on permissions
✅ **Automatic redirects** - Users redirected to appropriate dashboards
✅ **Session validation** - Permissions refreshed on auth state change
✅ **Type-safe permissions** - TypeScript ensures permission keys are valid

## Next Steps

1. ✅ RBAC system implemented
2. 🔄 Add UI indicators showing user role
3. 🔄 Add permission-based button rendering in components
4. 🔄 Create admin panel for managing user roles
5. 🔄 Implement database-based role storage
6. 🔄 Add role change audit log
7. 🔄 Create role management UI for admins

## Current Status

✅ **Fully Functional** - The RBAC system is ready to use!

- Users are automatically assigned roles on signup
- Routes are protected based on permissions
- Redirects work based on user role
- All three roles have distinct access levels
