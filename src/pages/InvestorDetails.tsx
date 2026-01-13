import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, Phone, MapPin, Building, ShieldCheck, FileText, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InvestorDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [investor, setInvestor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchInvestorDetails = async () => {
            setLoading(true);
            try {
                // Fetch basic details
                const { data: invData, error: invError } = await supabase
                    .from('investors')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (invError) throw invError;
                setInvestor(invData);

                // Fetch recent activity or related opportunities (mock for now if no table)
                // In a real scenario, we'd join 'opportunities' or 'activities' tables
            } catch (error) {
                console.error('Error fetching investor details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvestorDetails();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!investor) return <div className="p-8 text-center text-red-500">Investor not found.</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/investors')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Investors
            </button>

            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                            {investor.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{investor.name}</h1>
                            <div className="flex items-center gap-3 mt-2 text-gray-500 text-sm">
                                <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {investor.type}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    investor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                )}>{investor.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 shadow-sm">
                            Edit Profile
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            Log Activity
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Contact & Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact & Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{investor.contact_email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{investor.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{investor.country || 'Unknown'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pipeline / Investments (Placeholder) */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Investment History</h2>
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300">
                            <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No investment records found for this investor yet.</p>
                            <button className="mt-4 text-indigo-600 text-sm font-medium hover:underline">Record New Investment</button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Compliance & Docs */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Compliance Status</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Accreditation</span>
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    investor.accreditation_status === 'Accredited' ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                                )}>{investor.accreditation_status || 'Pending'}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">KYC Status</span>
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    investor.kyc_status === 'Verified' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                )}>{investor.kyc_status || 'Pending'}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">AML Status</span>
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    investor.aml_status === 'Verified' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                )}>{investor.aml_status || 'Pending'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Documents</h2>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <FileText className="w-4 h-4" /> No documents uploaded
                            </li>
                        </ul>
                        <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                            + Upload Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
