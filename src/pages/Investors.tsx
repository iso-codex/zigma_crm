import { useEffect, useState } from 'react';
import { useInvestorStore } from '@/store/useInvestorStore';
import { Plus, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvestorModal } from '@/components/investors/InvestorModal';

export default function Investors() {
    const { investors, loading, fetchInvestors } = useInvestorStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvestors();
    }, [fetchInvestors]);

    const filteredInvestors = investors.filter(inv =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Investors</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your relationships and portfolios</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Investor
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search investors..."
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
                <div className="text-center py-10">Loading investors...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvestors.map((investor) => (
                        <div key={investor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {investor.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-xs font-medium",
                                    investor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                )}>
                                    {investor.status}
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{investor.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{investor.type}</p>

                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 opacity-70">📧</span>
                                    {investor.contact_email || 'No email'}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-500">View Profile</button>
                                <button className="text-gray-400 hover:text-gray-600 text-sm">...</button>
                            </div>
                        </div>
                    ))}
                    {filteredInvestors.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No investors found. Add your first one!</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && <InvestorModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
