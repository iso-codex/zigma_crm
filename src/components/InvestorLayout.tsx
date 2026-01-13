import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, FileText, Download, User, LogOut, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InvestorLayout() {
    const { signOut, user } = useAuthStore();
    const location = useLocation();

    const navigation = [
        { name: 'Portfolio', href: '/investor/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', href: '/investor/transactions', icon: FileText },
        { name: 'Documents', href: '/investor/documents', icon: Download },
        { name: 'Profile', href: '/investor/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        <span className="text-2xl font-bold text-white tracking-wider">ZIGMA</span>
                        <span className="text-xs text-gray-400 bg-indigo-900/50 px-2 py-1 rounded">Investor</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className={cn(
                                                        isActive
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <button
                                    onClick={() => signOut()}
                                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white w-full text-left"
                                >
                                    <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="pl-72 w-full">
                {/* Top bar */}
                <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
                    <div className="flex items-center justify-end gap-4">
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                </p>
                                <p className="text-xs text-gray-500">Investor</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
