import { useState, useEffect } from 'react';
import { useOpportunityStore } from '@/store/useOpportunityStore';
import { useInvestorStore } from '@/store/useInvestorStore';
import { X } from 'lucide-react';

interface OpportunityModalProps {
    onClose: () => void;
}

export function OpportunityModal({ onClose }: OpportunityModalProps) {
    const { createOpportunity } = useOpportunityStore();
    const { investors, fetchInvestors } = useInvestorStore();
    const [formData, setFormData] = useState({
        investor_id: '',
        name: '',
        stage: 'Prospecting' as const,
        amount: 0,
        probability: 20,
        expected_close_date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInvestors();
    }, [fetchInvestors]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.investor_id) {
            alert('Please select an investor');
            return;
        }

        setLoading(true);
        try {
            await createOpportunity(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create opportunity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Opportunity</h2>
                    <p className="text-sm text-gray-500">Add a new deal to the pipeline.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Opportunity Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Series A Follow-on"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Investor
                        </label>
                        <select
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.investor_id}
                            onChange={e => setFormData({ ...formData, investor_id: e.target.value })}
                        >
                            <option value="">Select Investor...</option>
                            {investors.map(inv => (
                                <option key={inv.id} value={inv.id}>{inv.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.amount || ''}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Probability (%)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.probability}
                                onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stage
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.stage}
                            onChange={e => setFormData({ ...formData, stage: e.target.value as any })}
                        >
                            <option value="Prospecting">Prospecting</option>
                            <option value="Engagement">Engagement</option>
                            <option value="Due Diligence">Due Diligence</option>
                            <option value="Commitment">Commitment</option>
                            <option value="Subscription">Subscription</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Expected Close Date
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.expected_close_date}
                            onChange={e => setFormData({ ...formData, expected_close_date: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Opportunity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
