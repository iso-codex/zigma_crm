import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DollarSign, TrendingUp, FileText, Bell, Download, User, Upload, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Investment {
    id: string;
    fund_name: string;
    amount: number;
    shares: number;
    invested_date: string;
    current_value: number;
    return_percentage: number;
}

interface Transaction {
    id: string;
    investor_id: string;
    type: 'Investment' | 'Dividend' | 'Withdrawal' | 'Fee';
    amount: number;
    date: string;
    description: string;
}

interface Document {
    id: string;
    name: string;
    url: string;
    type: string;
    created_at: string;
}

interface PerformanceData {
    name: string;
    value: number;
}

interface InvestorPortalProps {
    initialTab?: 'overview' | 'transactions' | 'documents' | 'profile';
}

export default function InvestorPortal({ initialTab = 'overview' }: InvestorPortalProps) {
    const { user } = useAuthStore();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(initialTab);

    // Keep activeTab in sync with initialTab prop changes (e.g. from routing)
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    // Portfolio summary calculations
    const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
    const currentValue = investments.reduce((acc, inv) => acc + inv.current_value, 0);
    const totalReturns = currentValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;

    useEffect(() => {
        fetchInvestorData();
    }, [user]);

    const fetchInvestorData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // 1. Fetch the investor profile linked to this auth user
            const { data: investorData, error: investorError } = await supabase
                .from('investors')
                .select('id, name')
                .eq('auth_user_id', user.id)
                .single();

            if (investorError) {
                if (investorError.code === 'PGRST116') {
                    // No investor linked yet - this is a new user
                    setInvestments([]);
                    setTransactions([]);
                    setNotifications([{
                        id: 'welcome',
                        title: 'Welcome to Zigma',
                        message: 'An administrator will link your portfolio details shortly.',
                        date: new Date().toISOString(),
                        read: false
                    }]);
                    return;
                }
                throw investorError;
            }

            // 2. Fetch investments (subscriptions) for this investor
            const { data: subs, error: subsError } = await supabase
                .from('subscriptions')
                .select(`
                    id,
                    amount,
                    signed_date,
                    status,
                    opportunities ( name )
                `)
                .eq('investor_id', investorData.id);

            if (subsError) throw subsError;

            // Map subscriptions to Investment interface
            const mappedInvestments: Investment[] = (subs || []).map((s: any) => ({
                id: s.id,
                fund_name: s.opportunities?.name || 'Private Investment',
                amount: Number(s.amount),
                shares: 0,
                invested_date: s.signed_date || new Date().toISOString(),
                current_value: Number(s.amount) * 1.05, // Hypothetical growth
                return_percentage: 5.0
            }));

            setInvestments(mappedInvestments);

            // 3. Fetch Real Transactions
            const { data: txns, error: txnsError } = await supabase
                .from('transactions')
                .select('*')
                .eq('investor_id', investorData.id)
                .order('date', { ascending: false });

            if (txnsError) throw txnsError;
            setTransactions(txns || []);

            // 4. Fetch Real Documents
            const { data: docs, error: docsError } = await supabase
                .from('documents')
                .select('*')
                .eq('investor_id', investorData.id)
                .order('created_at', { ascending: false });

            if (docsError) throw docsError;
            setDocuments(docs || []);

            // 5. Generate Performance Chart Data (Mocking trend for now based on investments)
            const performanceTrend = [
                { name: 'Jan', value: totalInvested * 0.98 },
                { name: 'Feb', value: totalInvested * 0.99 },
                { name: 'Mar', value: totalInvested * 1.01 },
                { name: 'Apr', value: totalInvested * 1.03 },
                { name: 'May', value: totalInvested * 1.04 },
                { name: 'Jun', value: totalInvested * 1.05 },
            ];
            setPerformanceData(performanceTrend);

            // 6. Fetch Notifications
            setNotifications([
                { id: '1', title: 'Portfolio Updated', message: 'Your investment records have been synchronized.', date: new Date().toISOString(), read: false }
            ]);

        } catch (error) {
            console.error('Error fetching investor data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }: any) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-lg", colorClass)}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
            {subtitle && (
                <p className={cn("text-xs font-medium mt-2",
                    subtitle.startsWith('+') ? "text-green-600" : "text-red-600"
                )}>
                    {subtitle}
                </p>
            )}
        </div>
    );

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading your portfolio...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Investor Portal</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'transactions', label: 'Transactions', icon: FileText },
                        { id: 'documents', label: 'Documents', icon: Download },
                        { id: 'profile', label: 'Profile', icon: User },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                                activeTab === tab.id
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Invested"
                            value={`$${totalInvested.toLocaleString()}`}
                            icon={DollarSign}
                            colorClass="bg-blue-500"
                        />
                        <StatCard
                            title="Current Value"
                            value={`$${currentValue.toLocaleString()}`}
                            icon={TrendingUp}
                            colorClass="bg-green-500"
                        />
                        <StatCard
                            title="Total Returns"
                            value={`$${totalReturns.toLocaleString()}`}
                            subtitle={`+${returnPercentage.toFixed(2)}%`}
                            icon={TrendingUp}
                            colorClass="bg-emerald-500"
                        />
                        <StatCard
                            title="Active Investments"
                            value={investments.length}
                            icon={FileText}
                            colorClass="bg-indigo-500"
                        />
                    </div>

                    {/* Performance Analytics */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white">Portfolio Performance</h3>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                    <TrendingUp className="w-3 h-3" /> +5.2% YTD
                                </span>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Investment Portfolio */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Investments</h2>
                            <button className="text-sm text-indigo-600 font-medium flex items-center gap-1">
                                <FileText className="w-4 h-4" /> Reports
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fund / Opportunity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invested</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Return</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {investments.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{inv.fund_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">${inv.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${inv.current_value.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="text-green-600 font-medium">+{inv.return_percentage}%</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {investments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No investment data linked yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Notifications */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
                            <Bell className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div className={cn("w-2 h-2 mt-2 rounded-full", notif.read ? "bg-gray-300" : "bg-indigo-500")} />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">{notif.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(notif.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 text-sm font-semibold">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/30">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {transactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                txn.type === 'Investment' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                            )}>
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{txn.description}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            ${txn.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
                <div className="space-y-6">
                    {/* Upload Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload Documents</h2>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Drag and drop files here, or click to browse</p>
                            <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 text-sm font-semibold">
                                Choose Files
                            </button>
                        </div>
                    </div>

                    {/* Available Documents */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Documents</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white block">{doc.name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">{doc.type}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </a>
                                </div>
                            ))}
                            {documents.length === 0 && (
                                <div className="text-center py-8 text-gray-500 italic text-sm">No documents available yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                            <Settings className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                            <p className="text-gray-900 dark:text-white">{user?.user_metadata?.full_name || 'Not set'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                            <p className="text-gray-900 dark:text-white">{user?.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Phone</label>
                            <p className="text-gray-900 dark:text-white">{user?.user_metadata?.phone || 'Not set'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Investor ID</label>
                            <p className="text-gray-900 dark:text-white font-mono text-sm">{user?.id.substring(0, 8)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
