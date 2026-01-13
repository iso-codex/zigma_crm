import { useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Bell, MoreVertical, DollarSign, Users, MessageSquare, Briefcase, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

// KPI Card Component
const KPICard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-[140px]">
        <div className="flex justify-between items-start">
            <div className={cn("p-2 rounded-lg", colorClass)}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            {subtext && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {subtext}
                </span>
            )}
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
    </div>
);

export default function Dashboard() {
    const { metrics, fetchMetrics, loading } = useDashboardStore();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard
                    title="Total Revenue"
                    value={`$${(metrics.totalRevenue / 1000000).toFixed(1)}M`}
                    icon={DollarSign}
                    colorClass="bg-yellow-500"
                />
                <KPICard
                    title="New Leads"
                    value={metrics.newLeadsCount}
                    subtext="+12%"
                    icon={Users}
                    colorClass="bg-indigo-500"
                />
                <KPICard
                    title="Contacted"
                    value={metrics.contactedCount}
                    subtext="+5%"
                    icon={MessageSquare}
                    colorClass="bg-blue-500"
                />
                <KPICard
                    title="Negotiation"
                    value={metrics.negotiationCount}
                    subtext="+2%"
                    icon={Briefcase}
                    colorClass="bg-orange-500"
                />
                <KPICard
                    title="Closed Deals"
                    value={metrics.closedDealsCount}
                    subtext="+8%"
                    icon={CheckCircle}
                    colorClass="bg-green-500"
                />
            </div>

            {/* Analytics & News Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white">Performance Analytics</h3>
                        <select className="bg-gray-50 dark:bg-gray-700 border-none text-sm rounded-md px-2 py-1 outline-none text-gray-600">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                <Area type="monotone" dataKey="leads" stroke="#82ca9d" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Important News / Activity Feed */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white">Important News</h3>
                        <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">MJ</div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Follow up with Mr. Johnson</p>
                                <p className="text-xs text-gray-500 mt-1">Interested in Series A</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">12:30 pm</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xs shrink-0">LW</div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">New lead added</p>
                                <p className="text-xs text-gray-500 mt-1">Lisa Wong</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">10:00 am</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">DK</div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Meeting with TechGrow</p>
                                <p className="text-xs text-gray-500 mt-1">Discuss term sheet</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">Yesterday</span>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                        View all
                    </button>
                </div>
            </div>

            {/* Recent Leads Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Leads</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">View all ↗</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/30">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {metrics.recentLeads.map((lead: any) => (
                                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            lead.status === 'New' ? "bg-blue-100 text-blue-800" :
                                                lead.status === 'Qualified' ? "bg-green-100 text-green-800" :
                                                    "bg-gray-100 text-gray-800"
                                        )}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.contact_email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {metrics.recentLeads.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">No recent leads found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
