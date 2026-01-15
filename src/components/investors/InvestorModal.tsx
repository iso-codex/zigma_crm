import { useState, useEffect } from 'react';
import { useInvestorStore } from '@/store/useInvestorStore';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface InvestorModalProps {
    onClose: () => void;
}

export function InvestorModal({ onClose }: InvestorModalProps) {
    const { createInvestor } = useInvestorStore();
    const [users, setUsers] = useState<{ id: string, email: string }[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Individual',
        contact_email: '',
        status: 'Active',
        auth_user_id: '',
        preferences: {}
    });
    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setFetchingUsers(true);
            try {
                // Fetch users from profiles table (since we can't easily query auth.users from client)
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, email')
                    .order('email');

                if (error) throw error;
                setUsers(data || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setFetchingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Filter out empty auth_user_id
            const submitData = { ...formData };
            if (!submitData.auth_user_id) delete (submitData as any).auth_user_id;

            await createInvestor(submitData);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create investor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Investor</h2>
                    <p className="text-sm text-gray-500">Enter the details of the new investor.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Investor Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type
                            </label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Individual">Individual</option>
                                <option value="VC">Venture Capital</option>
                                <option value="Family Office">Family Office</option>
                                <option value="Corporate">Corporate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            value={formData.contact_email}
                            onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                        />
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                        <label className="block text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1.5 uppercase tracking-wider">
                            Link to System User
                        </label>
                        <select
                            className="w-full rounded-md border border-indigo-200 dark:border-indigo-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            value={formData.auth_user_id}
                            onChange={e => setFormData({ ...formData, auth_user_id: e.target.value })}
                        >
                            <option value="">-- No linked user --</option>
                            {fetchingUsers ? (
                                <option disabled>Loading users...</option>
                            ) : (
                                users.map(u => (
                                    <option key={u.id} value={u.id}>{u.email}</option>
                                ))
                            )}
                        </select>
                        <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70 mt-1.5">
                            Linking a user allows them to see their portfolio when they log in.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Country
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            value={(formData as any).country || ''}
                            onChange={e => setFormData({ ...formData, country: e.target.value } as any)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Accreditation
                            </label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={(formData as any).accreditation_status || 'Pending'}
                                onChange={e => setFormData({ ...formData, accreditation_status: e.target.value } as any)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Accredited">Accredited</option>
                                <option value="Not Accredited">Not Accredited</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Onboarding Stage
                            </label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={(formData as any).onboarding_stage || 'Lead'}
                                onChange={e => setFormData({ ...formData, onboarding_stage: e.target.value } as any)}
                            >
                                <option value="Lead">Lead</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Verified">Verified</option>
                                <option value="Active">Active</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Investor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
