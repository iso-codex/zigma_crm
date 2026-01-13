import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        }
                    }
                });
                if (error) throw error;
                // For demo purposes, we might want to alert or just auto-login if possible
                alert('Account created! Please sign in.');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 font-sans">
            {/* Left Panel - Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 mix-blend-multiply" />
                </div>

                <div className="relative z-10 w-full max-w-lg px-12 flex flex-col justify-between h-full py-12">
                    <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-blue-900 font-bold text-xl">Z</span>
                            </div>
                            Zigma
                        </div>
                        <Link to="/" className="text-sm font-medium text-white/80 hover:text-white flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Website
                        </Link>
                    </div>

                    <div className="mb-20">
                        <h1 className="text-5xl font-bold text-white leading-[1.1] mb-6">
                            Invest Smarter.<br />
                            Grow Faster.<br />
                            Manage Anywhere.
                        </h1>
                        <p className="text-indigo-200 text-lg mb-8 max-w-sm">
                            The all-in-one platform for modern investor relationship management.
                        </p>
                        <div className="flex gap-2">
                            <span className="w-8 h-1.5 bg-white rounded-full transition-all duration-300"></span>
                            <span className="w-2 h-1.5 bg-white/30 rounded-full hover:bg-white/50 cursor-pointer transition-all"></span>
                            <span className="w-2 h-1.5 bg-white/30 rounded-full hover:bg-white/50 cursor-pointer transition-all"></span>
                        </div>
                    </div>

                    <div className="text-indigo-300/60 text-xs">
                        © 2026 Zigma Limited. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
                <div className="w-full max-w-[420px] space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {isSignUp ? 'Create Account' : 'Welcome Back!'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isSignUp ? 'Enter your details to get started.' : 'Log in to access your investor portal.'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleAuth}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all outline-none pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {!isSignUp && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm flex items-center gap-2">
                                <span className="block w-1.5 h-1.5 bg-red-600 rounded-full" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Login')}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white dark:bg-gray-900 px-2 text-sm text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="font-semibold text-gray-900 dark:text-white hover:underline transition-all"
                        >
                            {isSignUp ? 'Sign in here' : 'Sign up here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
