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
                // Fetch user role from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching profile role:", profileError);
                }

                const userRole = (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'investor';
                const permissions = getRolePermissions(userRole);
                set({ session, user: session.user, role: userRole, permissions, loading: false });
            } else {
                set({ session: null, user: null, role: null, permissions: null, loading: false });
            }

            // listen for auth changes
            supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session?.user) {
                    // Fetch user role from profiles table on auth change
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();

                    const userRole = (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'investor';
                    const permissions = getRolePermissions(userRole);
                    set({ session, user: session.user, role: userRole, permissions, loading: false });
                } else {
                    set({ session: null, user: null, role: null, permissions: null, loading: false });
                }
            });

            // Listen for Realtime changes to the current user's profile
            if (session?.user) {
                supabase
                    .channel(`profile-updates-${session.user.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'profiles',
                            filter: `id=eq.${session.user.id}`
                        },
                        (payload) => {
                            console.log('Profile updated via Realtime:', payload.new);
                            const newRole = payload.new.role as UserRole;
                            if (newRole) {
                                const permissions = getRolePermissions(newRole);
                                set({ role: newRole, permissions });
                            }
                        }
                    )
                    .subscribe();
            }
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
