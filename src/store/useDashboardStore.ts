import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface DashboardMetrics {
    totalRevenue: number;
    newLeadsCount: number;
    contactedCount: number;
    negotiationCount: number;
    closedDealsCount: number;
    recentLeads: any[];
    chartData: any[];
}

interface DashboardState {
    metrics: DashboardMetrics;
    loading: boolean;
    fetchMetrics: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    metrics: {
        totalRevenue: 0,
        newLeadsCount: 0,
        contactedCount: 0,
        negotiationCount: 0,
        closedDealsCount: 0,
        recentLeads: [],
        chartData: [
            { name: 'Jan', revenue: 4000, leads: 24 },
            { name: 'Feb', revenue: 3000, leads: 13 },
            { name: 'Mar', revenue: 9800, leads: 22 },
            { name: 'Apr', revenue: 3908, leads: 20 },
            { name: 'May', revenue: 4800, leads: 21 },
            { name: 'Jun', revenue: 3800, leads: 25 },
            { name: 'Jul', revenue: 4300, leads: 12 },
        ]
    },
    loading: false,
    fetchMetrics: async () => {
        set({ loading: true });
        try {
            // 1. Fetch Opportunities for Revenue and Stage counts
            const { data: opps } = await supabase
                .from('opportunities')
                .select('amount, stage');

            const totalRevenue = opps?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
            const negotiationCount = opps?.filter(o => ['Due Diligence', 'Engagement'].includes(o.stage)).length || 0;
            const closedDealsCount = opps?.filter(o => o.stage === 'Closed').length || 0;

            // 2. Fetch Leads for counts and list
            const { data: leads } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            const newLeadsCount = leads?.filter(l => l.status === 'New').length || 0;
            const contactedCount = leads?.filter(l => l.status === 'Contacted').length || 0;
            const recentLeads = leads?.slice(0, 5) || []; // Top 5 recent

            set(state => ({
                metrics: {
                    ...state.metrics,
                    totalRevenue,
                    newLeadsCount,
                    contactedCount,
                    negotiationCount,
                    closedDealsCount,
                    recentLeads
                }
            }));

        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
        } finally {
            set({ loading: false });
        }
    }
}));
