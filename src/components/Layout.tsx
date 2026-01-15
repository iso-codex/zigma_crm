import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, Users, Target, FileText, LogOut, Activity, PieChart, Briefcase, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Layout() {
    const { signOut, hasPermission, role } = useAuthStore();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Investors', href: '/investors', icon: Users },
        { name: 'Users', href: '/users', icon: Shield, requiredPermission: 'manageUsers' },
        { name: 'Funds', href: '/funds', icon: Briefcase },
        { name: 'Opportunities', href: '/opportunities', icon: Target },
        { name: 'Leads', href: '/leads', icon: FileText },
        { name: 'Activities', href: '/activities', icon: Activity },
        { name: 'Reports', href: '/reports', icon: PieChart },
    ];

    const filteredNavigation = navigation.filter(item =>
        !item.requiredPermission || hasPermission(item.requiredPermission as any)
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        <span className="text-2xl font-bold text-white tracking-wider">ZIGMA</span>
                        <div className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">
                            {role}
                        </div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {filteredNavigation.map((item) => {
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
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
