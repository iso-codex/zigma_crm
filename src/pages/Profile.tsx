import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { User, Mail, Phone, Building, Shield, Lock, Save, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Profile() {
    const { user, role } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile data
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [bio, setBio] = useState('');

    // Password change
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setPhone(user.user_metadata?.phone || '');
            setCompany(user.user_metadata?.company || '');
            setBio(user.user_metadata?.bio || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    phone: phone,
                    company: company,
                    bio: bio,
                }
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setShowPasswordChange(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeColor = () => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'staff':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'investor':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account information and preferences</p>
            </div>

            {/* Message Banner */}
            {message && (
                <div className={cn(
                    "p-4 rounded-lg border",
                    message.type === 'success'
                        ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                        : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                )}>
                    {message.text}
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

                <div className="px-8 pb-8">
                    {/* Avatar Section */}
                    <div className="flex items-end -mt-16 mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                                <div className="w-28 h-28 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold">
                                    {user?.email?.[0].toUpperCase()}
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 shadow-lg">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="ml-6 flex-1 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {fullName || user?.email?.split('@')[0]}
                                </h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold uppercase", getRoleBadgeColor())}>
                                        {role}
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {user?.email}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 text-sm font-semibold"
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900 dark:text-white">{fullName || 'Not set'}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-900 dark:text-white">{user?.email}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter your phone number"
                                />
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900 dark:text-white">{phone || 'Not set'}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter your company name"
                                />
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <Building className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900 dark:text-white">{company || 'Not set'}</span>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                            </label>
                            {isEditing ? (
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-gray-900 dark:text-white">{bio || 'No bio added yet'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 font-semibold"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Settings</h3>

                <div className="space-y-6">
                    {/* Account Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">User ID</span>
                            </div>
                            <p className="text-xs font-mono text-gray-500 break-all">{user?.id}</p>
                        </div>

                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Created</span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {new Date(user?.created_at || '').toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Password Change */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <button
                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            <Lock className="w-4 h-4" />
                            Change Password
                        </button>

                        {showPasswordChange && (
                            <form onSubmit={handleChangePassword} className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 text-sm font-semibold"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordChange(false);
                                            setNewPassword('');
                                            setConfirmPassword('');
                                        }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
