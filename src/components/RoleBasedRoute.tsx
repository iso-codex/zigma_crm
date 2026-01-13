import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { type RolePermissions } from '@/lib/permissions';

interface RoleBasedRouteProps {
    children: React.ReactNode;
    requiredPermission?: keyof RolePermissions;
    allowedRoles?: ('admin' | 'staff' | 'investor')[];
    redirectTo?: string;
}

export const RoleBasedRoute = ({
    children,
    requiredPermission,
    allowedRoles,
    redirectTo
}: RoleBasedRouteProps) => {
    const { user, loading, role, hasPermission, getDefaultRoute } = useAuthStore();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
        const defaultRoute = redirectTo || getDefaultRoute();
        return <Navigate to={defaultRoute} replace />;
    }

    // Check if user role is in allowed roles
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        const defaultRoute = redirectTo || getDefaultRoute();
        return <Navigate to={defaultRoute} replace />;
    }

    return <>{children}</>;
};
