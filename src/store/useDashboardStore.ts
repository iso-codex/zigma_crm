import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

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
    subscribeToUpdates: () => void;
    unsubscribeFromUpdates: () => void;
}

let dashboardChannel: RealtimeChannel | null = null;

export const useDashboardStore = create<DashboardState>((set, get) => ({
    metrics: {
        totalRevenue: 0,
        newLeadsCount: 0,
        contactedCount: 0,
        negotiationCount: 0,
        closedDealsCount: 0,
        recentLeads: [],
        chartData: []
    },
    loading: false,
    fetchMetrics: async () => {
        set({ loading: true });
        try {
            // 1. Fetch Opportunities
            const { data: opps } = await supabase
                .from('opportunities')
                .select('amount, stage, created_at');

            const totalRevenue = opps?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
            const negotiationCount = opps?.filter(o => ['Due Diligence', 'Engagement', 'Prospecting'].includes(o.stage)).length || 0;
            const closedDealsCount = opps?.filter(o => o.stage === 'Closed').length || 0;

            // 2. Fetch Leads
            const { data: leads } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            const newLeadsCount = leads?.filter(l => l.status === 'New').length || 0;
            const contactedCount = leads?.filter(l => l.status === 'Contacted').length || 0;
            const recentLeads = leads?.slice(0, 5) || [];

            // 3. Generate Chart Data (Simulated distribution based on actual totals for demo purposes)
            // In a real app, this would aggregate by month from created_at
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
            const chartData = months.map((month, index) => ({
                name: month,
                revenue: Math.floor(totalRevenue * (0.1 + Math.random() * 0.1) * (index + 1)), // Simulated curve
                leads: Math.floor((leads?.length || 0) * (0.1 + Math.random() * 0.1) * (index + 1))
            }));

            set(state => ({
                metrics: {
                    ...state.metrics,
                    totalRevenue,
                    newLeadsCount,
                    contactedCount,
                    negotiationCount,
                    closedDealsCount,
                    recentLeads,
                    chartData: chartData.length > 0 ? chartData : state.metrics.chartData
                }
            }));

        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
        } finally {
            set({ loading: false });
        }
    },
    subscribeToUpdates: () => {
        if (dashboardChannel) return;

        dashboardChannel = supabase
            .channel('dashboard-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'leads' },
                () => {
                    get().fetchMetrics();
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'opportunities' },
                () => {
                    get().fetchMetrics();
                }
            )
            .subscribe();
    },
    unsubscribeFromUpdates: () => {
        if (dashboardChannel) {
            supabase.removeChannel(dashboardChannel);
            dashboardChannel = null;
        }
    }
}));
