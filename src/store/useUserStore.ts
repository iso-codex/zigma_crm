import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { type UserRole } from '@/lib/permissions';

export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
}

interface UserState {
    users: UserProfile[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    updateUserRole: (userId: string, role: UserRole) => Promise<void>;
    subscribeToUpdates: () => () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    loading: false,
    error: null,
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ users: data as UserProfile[], loading: false });
        } catch (error: any) {
            console.error('Error fetching users:', error);
            set({ error: error.message, loading: false });
        }
    },
    updateUserRole: async (userId: string, role: UserRole) => {
        set({ loading: true, error: null });
        try {
            // 1. Update the database profile
            const { error: dbError } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', userId);

            if (dbError) throw dbError;

            // Update local state immediately for snappier UI
            set(state => ({
                users: state.users.map(u => u.id === userId ? { ...u, role } : u),
                loading: false
            }));

        } catch (error: any) {
            console.error('Error updating user role:', error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },
    subscribeToUpdates: () => {
        const channel = supabase
            .channel('profiles-all-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles'
                },
                (payload) => {
                    const { eventType, new: newRecord, old: oldRecord } = payload;

                    if (eventType === 'UPDATE' || eventType === 'INSERT') {
                        set(state => {
                            const exists = state.users.some(u => u.id === newRecord.id);
                            if (exists) {
                                return {
                                    users: state.users.map(u => u.id === newRecord.id ? (newRecord as UserProfile) : u)
                                };
                            } else {
                                return {
                                    users: [newRecord as UserProfile, ...state.users]
                                };
                            }
                        });
                    } else if (eventType === 'DELETE') {
                        set(state => ({
                            users: state.users.filter(u => u.id === oldRecord.id)
                        }));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
}));
