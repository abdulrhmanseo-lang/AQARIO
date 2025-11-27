import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import {
    Building2, Users, FileText, DollarSign, TrendingUp,
    Plus, Edit, Trash2, Eye, Search, Filter, Globe, BarChart3,
    ArrowUpRight, ArrowDownRight, Calendar, MapPin, Phone, Mail
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const { language, toggleLanguage, t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [properties, setProperties] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [statsRes, propsRes, clientsRes] = await Promise.all([
                axios.get('/dashboard/stats/').catch(() => ({ data: null })),
                axios.get('/properties/').catch(() => ({ data: [] })),
                axios.get('/clients/').catch(() => ({ data: [] })),
            ]);

            setStats(statsRes.data || {
                counts: { properties: 0, clients: 0, active_contracts: 0 },
                financial: { total_revenue: 0, pending_amount: 0, overdue_amount: 0 },
                charts: { monthly_revenue: [], property_distribution: [] }
            });
            setProperties(propsRes.data);
            setClients(clientsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProperty = async (id) => {
        if (!confirm(t('هل أنت متأكد من حذف هذا العقار؟', 'Are you sure you want to delete this property?'))) return;
        try {
            await axios.delete(`/properties/${id}/`);
            setProperties(properties.filter(p => p.id !== id));
        } catch (error) {
            alert(t('حدث خطأ أثناء الحذف', 'Error deleting property'));
        }
    };

    const deleteClient = async (id) => {
        if (!confirm(t('هل أنت متأكد من حذف هذا العميل؟', 'Are you sure you want to delete this client?'))) return;
        try {
            await axios.delete(`/clients/${id}/`);
            setClients(clients.filter(c => c.id !== id));
        } catch (error) {
            alert(t('حدث خطأ أثناء الحذف', 'Error deleting client'));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">{t('جاري التحميل...', 'Loading...')}</p>
                </div>
            </div>
        );
    }

    const revenueChartData = {
        labels: stats?.charts?.monthly_revenue?.map(item => item.month) || [],
        datasets: [{
            label: t('الإيرادات', 'Revenue'),
            data: stats?.charts?.monthly_revenue?.map(item => item.revenue) || [],
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 3,
            pointBackgroundColor: 'rgb(139, 92, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
        }],
    };

    const propertyDistributionData = {
        labels: stats?.charts?.property_distribution?.map(item => item.property_type) || [],
        datasets: [{
            data: stats?.charts?.property_distribution?.map(item => item.count) || [],
            backgroundColor: [
                'rgba(139, 92, 246, 0.9)',
                'rgba(167, 139, 250, 0.9)',
                'rgba(196, 181, 253, 0.9)',
                'rgba(221, 214, 254, 0.9)',
                'rgba(237, 233, 254, 0.9)',
            ],
            borderWidth: 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#4B5563',
                    font: { size: 12, weight: '500' },
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#111827',
                bodyColor: '#4B5563',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
            }
        },
        scales: {
            y: {
                ticks: { color: '#6B7280', font: { size: 11 } },
                grid: { color: '#F3F4F6', drawBorder: false },
                border: { display: false },
            },
            x: {
                ticks: { color: '#6B7280', font: { size: 11 } },
                grid: { display: false },
                border: { display: false },
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                {t('لوحة التحكم', 'Dashboard')}
                            </h1>
                            <p className="text-gray-500">
                                {t('مرحباً بك! إليك نظرة عامة على نشاطك', 'Welcome back! Here\'s your overview')}
                            </p>
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-700 px-5 py-2.5 rounded-xl transition-all font-medium border border-violet-200"
                        >
                            <Globe size={18} />
                            {language === 'ar' ? 'English' : 'العربية'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Tabs */}
                <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm inline-flex">
                    <TabButton
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                        label={t('نظرة عامة', 'Overview')}
                    />
                    <TabButton
                        active={activeTab === 'properties'}
                        onClick={() => setActiveTab('properties')}
                        label={t('العقارات', 'Properties')}
                    />
                    <TabButton
                        active={activeTab === 'clients'}
                        onClick={() => setActiveTab('clients')}
                        label={t('العملاء', 'Clients')}
                    />
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title={t('العقارات', 'Properties')}
                                value={stats?.counts?.properties || 0}
                                icon={Building2}
                                color="violet"
                                trend="+12%"
                                trendUp={true}
                            />
                            <StatCard
                                title={t('العملاء', 'Clients')}
                                value={stats?.counts?.clients || 0}
                                icon={Users}
                                color="blue"
                                trend="+8%"
                                trendUp={true}
                            />
                            <StatCard
                                title={t('العقود النشطة', 'Active Contracts')}
                                value={stats?.counts?.active_contracts || 0}
                                icon={FileText}
                                color="emerald"
                                trend="+5%"
                                trendUp={true}
                            />
                            <StatCard
                                title={t('إجمالي الإيرادات', 'Total Revenue')}
                                value={`$${(stats?.financial?.total_revenue || 0).toLocaleString()}`}
                                icon={DollarSign}
                                color="amber"
                                trend="+15%"
                                trendUp={true}
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {t('اتجاه الإيرادات', 'Revenue Trend')}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        {t('آخر 6 أشهر', 'Last 6 months')}
                                    </div>
                                </div>
                                <div className="h-80">
                                    <Line data={revenueChartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {t('توزيع العقارات', 'Property Distribution')}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <BarChart3 size={16} />
                                        {t('حسب النوع', 'By Type')}
                                    </div>
                                </div>
                                <div className="h-80">
                                    <Doughnut data={propertyDistributionData} options={{ ...chartOptions, scales: undefined }} />
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FinancialCard
                                title={t('المدفوعات المعلقة', 'Pending Payments')}
                                amount={stats?.financial?.pending_amount || 0}
                                icon={TrendingUp}
                                trend="warning"
                                language={language}
                            />
                            <FinancialCard
                                title={t('المدفوعات المتأخرة', 'Overdue Payments')}
                                amount={stats?.financial?.overdue_amount || 0}
                                icon={TrendingUp}
                                trend="danger"
                                language={language}
                            />
                            <FinancialCard
                                title={t('إجمالي الإيرادات', 'Total Revenue')}
                                amount={stats?.financial?.total_revenue || 0}
                                icon={DollarSign}
                                trend="success"
                                language={language}
                            />
                        </div>
                    </>
                )}

                {/* Properties Tab */}
                {activeTab === 'properties' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('إدارة العقارات', 'Property Management')}
                            </h2>
                            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-lg shadow-violet-600/30">
                                <Plus size={20} />
                                {t('إضافة عقار', 'Add Property')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onDelete={deleteProperty}
                                    language={language}
                                    t={t}
                                />
                            ))}
                        </div>

                        {properties.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                <Building2 size={64} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {t('لا توجد عقارات', 'No properties found')}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {t('ابدأ بإضافة عقارك الأول', 'Start by adding your first property')}
                                </p>
                                <button className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium">
                                    <Plus size={20} />
                                    {t('إضافة عقار', 'Add Property')}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Clients Tab */}
                {activeTab === 'clients' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('إدارة العملاء', 'Client Management')}
                            </h2>
                            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-lg shadow-violet-600/30">
                                <Plus size={20} />
                                {t('إضافة عميل', 'Add Client')}
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-start text-sm font-semibold text-gray-700">
                                                {t('الاسم', 'Name')}
                                            </th>
                                            <th className="px-6 py-4 text-start text-sm font-semibold text-gray-700">
                                                {t('الهاتف', 'Phone')}
                                            </th>
                                            <th className="px-6 py-4 text-start text-sm font-semibold text-gray-700">
                                                {t('البريد الإلكتروني', 'Email')}
                                            </th>
                                            <th className="px-6 py-4 text-start text-sm font-semibold text-gray-700">
                                                {t('الإجراءات', 'Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {clients.map((client) => (
                                            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                                            {client.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-gray-900 font-medium">{client.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone size={16} className="text-gray-400" />
                                                        {client.phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail size={16} className="text-gray-400" />
                                                        {client.email || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                                            <Eye size={18} />
                                                        </button>
                                                        <button className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteClient(client.id)}
                                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {clients.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                <Users size={64} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {t('لا يوجد عملاء', 'No clients found')}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {t('ابدأ بإضافة عميلك الأول', 'Start by adding your first client')}
                                </p>
                                <button className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium">
                                    <Plus size={20} />
                                    {t('إضافة عميل', 'Add Client')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 font-medium rounded-lg transition-all ${active
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
        >
            {label}
        </button>
    );
}

function StatCard({ title, value, icon: Icon, color, trend, trendUp }) {
    const colors = {
        violet: 'from-violet-500 to-purple-600',
        blue: 'from-blue-500 to-cyan-600',
        emerald: 'from-emerald-500 to-teal-600',
        amber: 'from-amber-500 to-orange-600',
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
                    <Icon size={28} className="text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-gray-500 text-sm mb-1 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

function FinancialCard({ title, amount, icon: Icon, trend, language }) {
    const trendConfig = {
        success: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            icon: 'text-emerald-600'
        },
        warning: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
            icon: 'text-amber-600'
        },
        danger: {
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-200',
            icon: 'text-red-600'
        },
    };

    const config = trendConfig[trend];

    return (
        <div className={`${config.bg} rounded-2xl p-6 border ${config.border}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-white shadow-sm ${config.icon}`}>
                    <Icon size={24} />
                </div>
                <h4 className={`font-semibold ${config.text}`}>{title}</h4>
            </div>
            <p className={`text-3xl font-bold ${config.text}`}>
                ${amount.toLocaleString()}
            </p>
        </div>
    );
}

function PropertyCard({ property, onDelete, language, t }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all group">
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                {property.main_image ? (
                    <img
                        src={property.main_image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100">
                        <Building2 size={48} className="text-violet-400" />
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-violet-700 text-sm font-semibold shadow-md">
                    {property.property_type}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <MapPin size={16} className="text-gray-400" />
                    {property.city}, {property.address}
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="text-violet-600 font-bold text-xl">
                        ${parseFloat(property.price).toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-sm font-medium">
                        {property.area} {t('م²', 'm²')}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <button className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                        <Eye size={16} />
                        {t('عرض', 'View')}
                    </button>
                    <button className="flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                        <Edit size={16} />
                        {t('تعديل', 'Edit')}
                    </button>
                    <button
                        onClick={() => onDelete(property.id)}
                        className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 size={16} />
                        {t('حذف', 'Delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}
