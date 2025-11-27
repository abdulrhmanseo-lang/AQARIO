import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Building2,
    FileText,
    CreditCard,
    LogOut,
    Menu,
    X,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
        { path: '/properties', icon: Building2, label: 'العقارات' },
        { path: '/clients', icon: Users, label: 'العملاء' },
        { path: '/contracts', icon: FileText, label: 'العقود' },
        { path: '/finance', icon: CreditCard, label: 'المالية' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-white border-r border-gray-200 flex-shrink-0 overflow-hidden shadow-sm"
                    >
                        {/* Logo */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30">
                                    <Building2 size={22} className="text-white" />
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-gray-900">
                                        عقاريّو
                                    </span>
                                    <p className="text-xs text-gray-500">Aqario</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-6 px-4 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-violet-50 text-violet-700 font-semibold border border-violet-200 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile */}
                        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.username}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm w-full px-4 py-2.5 rounded-xl transition-all font-medium border border-red-200"
                            >
                                <LogOut size={16} />
                                تسجيل الخروج
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center gap-4">
                        {/* Add notifications or other header items here */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
