import { Link } from 'react-router-dom';
import { Building2, TrendingUp, ShieldCheck, Users, ArrowRight, Wallet, PieChart, Globe } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-slate-900 font-bold text-xl">Z</span>
                            </div>
                            <span>Zigma</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                            <a href="#opportunities" className="hover:text-white transition-colors">Opportunities</a>
                            <a href="#services" className="hover:text-white transition-colors">Services</a>
                            <a href="#about" className="hover:text-white transition-colors">About</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                className="bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-20 bg-slate-900 h-[700px] flex items-center overflow-hidden">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                        alt="City Skyline"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <h4 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-4">
                            Zigma Limited Financial Services
                        </h4>
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
                            Capital & Investment <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                Market Solutions
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
                            Connecting visionary investors with high-growth opportunities.
                            Manage your portfolio, track fund performance, and secure your financial future with Zigma branding.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
                            >
                                For Investors <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                            >
                                For Companies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature stats floating card (Overlap effect) */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="flex items-center gap-4 p-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Active Investors</p>
                            <p className="text-2xl font-bold text-gray-900">2,500+</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-2">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Capital Raised</p>
                            <p className="text-2xl font-bold text-gray-900">$150M+</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-2">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Active Funds</p>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-2">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Global Reach</p>
                            <p className="text-2xl font-bold text-gray-900">30+ Countries</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <section id="services" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-gray-600 text-lg">Comprehensive financial solutions tailored for modern investors and forward-thinking companies.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
                                    alt="Fund Management"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-200">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Funds Management</h3>
                                <p className="text-gray-600 mb-6">Expertly managed investment vehicles designed to maximize returns while strictly calculating risk.</p>
                                <Link to="/login" className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Service 2 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                    alt="Equity Capital"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-200">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Equity Capital Markets</h3>
                                <p className="text-gray-600 mb-6">Connecting growth-stage companies with the capital they need to scale through our vast network.</p>
                                <Link to="/login" className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Service 3 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop"
                                    alt="Advisory"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg shadow-slate-200">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Strategic Advisory</h3>
                                <p className="text-gray-600 mb-6">Bespoke financial advice for mergers, acquisitions, and comprehensive wealth planning.</p>
                                <Link to="/login" className="flex items-center text-slate-800 font-semibold group-hover:translate-x-1 transition-transform">
                                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-900/10 skew-x-12 transform origin-bottom"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to start your journey?</h2>
                    <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
                        Join thousands of investors using Zigma to manage their assets and discover new opportunities.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block bg-white text-slate-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl shadow-white/10"
                    >
                        Create Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                                <span className="text-slate-950 font-bold text-sm">Z</span>
                            </div>
                            <span className="text-white font-bold text-lg">Zigma</span>
                        </div>
                        <div className="text-sm">
                            © 2026 Zigma Limited. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
