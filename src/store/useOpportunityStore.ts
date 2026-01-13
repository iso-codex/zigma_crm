import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Opportunity {
    id: string;
    investor_id: string;
    name: string;
    stage: 'Prospecting' | 'Engagement' | 'Due Diligence' | 'Commitment' | 'Subscription' | 'Closed' | 'Lost';
    amount: number;
    probability: number;
    expected_close_date: string;
    investor?: { name: string }; // joined data
}

interface OpportunityState {
    opportunities: Opportunity[];
    loading: boolean;
    error: string | null;
    fetchOpportunities: () => Promise<void>;
    updateStage: (id: string, stage: Opportunity['stage']) => Promise<void>;
    createOpportunity: (opp: Omit<Opportunity, 'id' | 'investor'>) => Promise<void>;
}

export const useOpportunityStore = create<OpportunityState>((set, get) => ({
    opportunities: [],
    loading: false,
    error: null,
    fetchOpportunities: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('opportunities')
                .select('*, investor:investors(name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ opportunities: data as any });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
    updateStage: async (id, stage) => {
        // Optimistic update
        const currentOpps = get().opportunities;
        set({ opportunities: currentOpps.map(o => o.id === id ? { ...o, stage } : o) });

        try {
            const { error } = await supabase
                .from('opportunities')
                .update({ stage })
                .eq('id', id);

            if (error) throw error;
        } catch (err: any) {
            set({ error: err.message, opportunities: currentOpps }); // Revert
        }
    },
    createOpportunity: async (opp) => {
        set({ loading: true });
        try {
            const { error } = await supabase
                .from('opportunities')
                .insert([opp]);

            if (error) throw error;
            await get().fetchOpportunities();
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    }
}));
