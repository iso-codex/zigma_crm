import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DollarSign, TrendingUp, FileText, Bell, Download, User, Upload, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    type: string;
    amount: number;
    date: string;
    description: string;
}

export default function InvestorPortal() {
    const { user } = useAuthStore();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'documents' | 'profile'>('overview');

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
            // Mock data for now - replace with actual Supabase queries
            setInvestments([
                {
                    id: '1',
                    fund_name: 'Tech Growth Fund',
                    amount: 50000,
                    shares: 100,
                    invested_date: '2024-01-15',
                    current_value: 58500,
                    return_percentage: 17.0
                },
                {
                    id: '2',
                    fund_name: 'Real Estate Fund',
                    amount: 75000,
                    shares: 150,
                    invested_date: '2024-03-20',
                    current_value: 82500,
                    return_percentage: 10.0
                }
            ]);

            setTransactions([
                { id: '1', type: 'Investment', amount: 50000, date: '2024-01-15', description: 'Tech Growth Fund - Initial Investment' },
                { id: '2', type: 'Dividend', amount: 2500, date: '2024-06-15', description: 'Tech Growth Fund - Q2 Dividend' },
                { id: '3', type: 'Investment', amount: 75000, date: '2024-03-20', description: 'Real Estate Fund - Initial Investment' },
                { id: '4', type: 'Dividend', amount: 1500, date: '2024-09-15', description: 'Real Estate Fund - Q3 Dividend' },
            ]);

            setNotifications([
                { id: '1', title: 'Q4 Dividend Payment', message: 'Your dividend will be processed on Dec 31', date: '2024-12-01', read: false },
                { id: '2', title: 'Annual Report Available', message: 'Download your 2024 annual report', date: '2024-11-15', read: true },
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

                    {/* Investment Portfolio */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Investments</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fund</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invested</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Shares</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Return</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {investments.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{inv.fund_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">${inv.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{inv.shares}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${inv.current_value.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="text-green-600 font-medium">+{inv.return_percentage}%</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.invested_date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
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
                            {['Annual Statement 2024.pdf', 'Investment Agreement.pdf', 'Tax Document 2024.pdf'].map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{doc}</span>
                                    </div>
                                    <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            ))}
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
