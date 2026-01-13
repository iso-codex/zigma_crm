import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { type UserRole, getRolePermissions, type RolePermissions, getDefaultRoute } from '@/lib/permissions';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    role: UserRole | null;
    permissions: RolePermissions | null;
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    getUserRole: () => UserRole;
    hasPermission: (permission: keyof RolePermissions) => boolean;
    getDefaultRoute: () => string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    loading: true,
    role: null,
    permissions: null,
    initialize: async () => {
        try {
            // get initial session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Get user role from user metadata or database
                // For now, we'll use metadata. In production, fetch from a user_roles table
                const userRole = (session.user.user_metadata?.role as UserRole) || 'investor';
                const permissions = getRolePermissions(userRole);
                set({ session, user: session.user, role: userRole, permissions, loading: false });
            } else {
                set({ session: null, user: null, role: null, permissions: null, loading: false });
            }

            // listen for changes
            supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    const userRole = (session.user.user_metadata?.role as UserRole) || 'investor';
                    const permissions = getRolePermissions(userRole);
                    set({ session, user: session.user, role: userRole, permissions, loading: false });
                } else {
                    set({ session: null, user: null, role: null, permissions: null, loading: false });
                }
            });
        } catch (error) {
            console.error("Auth init error:", error);
            set({ loading: false });
        }
    },
    signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, role: null, permissions: null });
    },
    signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        });
        if (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    },
    getUserRole: () => {
        return get().role || 'investor';
    },
    hasPermission: (permission: keyof RolePermissions) => {
        const { permissions } = get();
        return permissions ? permissions[permission] : false;
    },
    getDefaultRoute: () => {
        const role = get().role;
        return role ? getDefaultRoute(role) : '/login';
    },
}));
