import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Lead {
    id: string;
    name: string;
    source: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Disqualified';
    contact_email: string;
    notes: string;
}

interface LeadState {
    leads: Lead[];
    loading: boolean;
    error: string | null;
    fetchLeads: () => Promise<void>;
    createLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
    updateStatus: (id: string, status: Lead['status']) => Promise<void>;
}

export const useLeadStore = create<LeadState>((set, get) => ({
    leads: [],
    loading: false,
    error: null,
    fetchLeads: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ leads: data as Lead[] });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
    createLead: async (lead) => {
        set({ loading: true });
        try {
            const { error } = await supabase
                .from('leads')
                .insert([lead]);
            if (error) throw error;
            await get().fetchLeads();
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
    updateStatus: async (id, status) => {
        // Optimistic
        const currentLeads = get().leads;
        set({ leads: currentLeads.map(l => l.id === id ? { ...l, status } : l) });

        try {
            const { error } = await supabase
                .from('leads')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
        } catch (err: any) {
            set({ error: err.message, leads: currentLeads });
        }
    }
}));
