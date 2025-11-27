import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Building2, Users, FileText, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get('/dashboard/stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Fallback to mock data if API fails
            setStats({
                counts: { properties: 0, clients: 0, active_contracts: 0 },
                financial: { total_revenue: 0, pending_amount: 0, overdue_amount: 0 },
                charts: { monthly_revenue: [], property_distribution: [] }
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const revenueChartData = {
        labels: stats?.charts?.monthly_revenue?.map(item => item.month) || [],
        datasets: [
            {
                label: 'Revenue',
                data: stats?.charts?.monthly_revenue?.map(item => item.revenue) || [],
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const propertyDistributionData = {
        labels: stats?.charts?.property_distribution?.map(item => item.property_type) || [],
        datasets: [
            {
                data: stats?.charts?.property_distribution?.map(item => item.count) || [],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#9CA3AF',
                },
            },
        },
        scales: {
            y: {
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            x: {
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back! Here's your overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Properties"
                    value={stats?.counts?.properties || 0}
                    icon={Building2}
                    color="bg-violet-500/20 text-violet-400"
                />
                <StatCard
                    title="Clients"
                    value={stats?.counts?.clients || 0}
                    icon={Users}
                    color="bg-emerald-500/20 text-emerald-400"
                />
                <StatCard
                    title="Active Contracts"
                    value={stats?.counts?.active_contracts || 0}
                    icon={FileText}
                    color="bg-blue-500/20 text-blue-400"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${(stats?.financial?.total_revenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-amber-500/20 text-amber-400"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
                    <div className="h-64">
                        <Line data={revenueChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Property Distribution</h3>
                    <div className="h-64">
                        <Doughnut data={propertyDistributionData} options={{ ...chartOptions, scales: undefined }} />
                    </div>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancialCard
                    title="Pending Payments"
                    amount={stats?.financial?.pending_amount || 0}
                    icon={TrendingUp}
                    trend="warning"
                />
                <FinancialCard
                    title="Overdue Payments"
                    amount={stats?.financial?.overdue_amount || 0}
                    icon={TrendingDown}
                    trend="danger"
                />
                <FinancialCard
                    title="Total Revenue"
                    amount={stats?.financial?.total_revenue || 0}
                    icon={DollarSign}
                    trend="success"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-gray-700 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}

function FinancialCard({ title, amount, icon: Icon, trend }) {
    const trendColors = {
        success: 'text-emerald-400',
        warning: 'text-amber-400',
        danger: 'text-red-400',
    };

    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
                <Icon size={20} className={trendColors[trend]} />
                <h4 className="text-gray-400 font-medium">{title}</h4>
            </div>
            <p className={`text-2xl font-bold ${trendColors[trend]}`}>
                ${amount.toLocaleString()}
            </p>
        </div>
    );
}
