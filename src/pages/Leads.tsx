import { useEffect, useState } from 'react';
import { useLeadStore } from '@/store/useLeadStore';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadModal } from '@/components/leads/LeadModal';

export default function Leads() {
    const { leads, loading, fetchLeads, updateStatus } = useLeadStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
                    <p className="text-gray-500 text-sm mt-1">Track and unexpected potential investors</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Lead
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {leads.map((lead) => (
                            <tr key={lead.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                                            <div className="text-sm text-gray-500">{lead.contact_email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{lead.source}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                        lead.status === 'New' ? "bg-blue-100 text-blue-800" :
                                            lead.status === 'Qualified' ? "bg-green-100 text-green-800" :
                                                lead.status === 'Disqualified' ? "bg-red-100 text-red-800" :
                                                    "bg-gray-100 text-gray-800"
                                    )}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => updateStatus(lead.id, 'Qualified')}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Qualify
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">Edit</button>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No leads found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <LeadModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
