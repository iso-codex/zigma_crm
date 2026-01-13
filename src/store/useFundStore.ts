import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Fund {
    id: string;
    name: string;
    description?: string;
    target_amount: number;
    min_investment: number;
    expected_roi?: number;
    duration_months?: number;
    status: 'Open' | 'Fully Subscribed' | 'Closed' | 'Exited';
    risk_level?: 'Low' | 'Medium' | 'High';
    nav?: number;
}

interface FundState {
    funds: Fund[];
    loading: boolean;
    error: string | null;
    fetchFunds: () => Promise<void>;
    createFund: (fund: Omit<Fund, 'id'>) => Promise<void>;
}

export const useFundStore = create<FundState>((set, get) => ({
    funds: [],
    loading: false,
    error: null,
    fetchFunds: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('funds')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ funds: data as Fund[] });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
    createFund: async (fund) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('funds')
                .insert([fund]);

            if (error) throw error;
            await get().fetchFunds();
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },
}));
