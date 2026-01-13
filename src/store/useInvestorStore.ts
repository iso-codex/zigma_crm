import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Investor {
    id: string;
    name: string;
    type: string;
    status: string;
    contact_email: string;
    preferences: any;
    country?: string;
    accreditation_status?: 'Pending' | 'Accredited' | 'Not Accredited';
    kyc_status?: 'Pending' | 'Verified' | 'Rejected';
    aml_status?: 'Pending' | 'Verified' | 'Rejected';
    onboarding_stage?: 'Lead' | 'Qualified' | 'Verified' | 'Active';
}

interface InvestorState {
    investors: Investor[];
    loading: boolean;
    error: string | null;
    fetchInvestors: () => Promise<void>;
    createInvestor: (investor: Omit<Investor, 'id'>) => Promise<void>;
}

export const useInvestorStore = create<InvestorState>((set, get) => ({
    investors: [],
    loading: false,
    error: null,
    fetchInvestors: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('investors')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ investors: data as Investor[] });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
    createInvestor: async (investor) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('investors')
                .insert([investor]);

            if (error) throw error;
            await get().fetchInvestors();
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },
}));
