import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthCallback() {
    const navigate = useNavigate();
    const { user, loading, getDefaultRoute } = useAuthStore();

    useEffect(() => {
        if (!loading && user) {
            // Redirect to role-appropriate dashboard
            const defaultRoute = getDefaultRoute();
            navigate(defaultRoute, { replace: true });
        } else if (!loading && !user) {
            // If no user after loading, redirect to login
            navigate('/login', { replace: true });
        }
    }, [user, loading, navigate, getDefaultRoute]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
