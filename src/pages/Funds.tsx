import { useEffect, useState } from 'react';
import { useFundStore } from '@/store/useFundStore';
import { Plus, Search, Filter, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FundModal } from '@/components/funds/FundModal';

export default function Funds() {
    const { funds, loading, fetchFunds } = useFundStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFunds();
    }, [fetchFunds]);

    const filteredFunds = funds.filter(fund =>
        fund.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Funds & Projects</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage investment vehicles and performance</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create Fund
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search funds..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading funds...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFunds.map((fund) => (
                        <div key={fund.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{fund.name}</h3>
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                        fund.status === 'Open' ? "bg-green-100 text-green-800" :
                                            fund.status === 'Fully Subscribed' ? "bg-blue-100 text-blue-800" :
                                                "bg-gray-100 text-gray-800"
                                    )}>
                                        {fund.status}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{fund.description || 'No description provided.'}</p>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">Target</p>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">${(fund.target_amount / 1000000).toFixed(1)}M</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                                            <TrendingUp className="w-3 h-3" /> ROI
                                        </div>
                                        <p className="font-semibold text-green-600 text-sm">{fund.expected_roi}%</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                                            <AlertCircle className="w-3 h-3" /> Risk
                                        </div>
                                        <p className={cn(
                                            "font-semibold text-sm",
                                            fund.risk_level === 'High' ? "text-red-600" :
                                                fund.risk_level === 'Medium' ? "text-yellow-600" :
                                                    "text-green-600"
                                        )}>{fund.risk_level}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{fund.duration_months} Months</span>
                                </div>
                                <span className="text-indigo-600 font-medium cursor-pointer hover:underline">View Details</span>
                            </div>
                        </div>
                    ))}
                    {filteredFunds.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No funds found. Create your first fund to start tracking!</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && <FundModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
