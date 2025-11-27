import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Building2, Users, FileText, DollarSign } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Dashboard() {
    const [stats, setStats] = useState({
        properties: 0,
        contracts: 0,
        revenue: 0,
        clients: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // In a real app, we would have a dedicated stats endpoint
            // For now, we'll fetch lists and count
            const [props, conts, invs] = await Promise.all([
                api.get('/properties/'),
                api.get('/contracts/'),
                api.get('/finance/')
            ]);

            const revenue = invs.data
                .filter(i => i.status === 'PAID')
                .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

            setStats({
                properties: props.data.length,
                contracts: conts.data.length,
                revenue: revenue,
                clients: 5 // Mock client count
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#9ca3af' }
            }
        },
        scales: {
            y: {
                grid: { color: '#374151' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { color: '#374151' },
                ticks: { color: '#9ca3af' }
            }
        }
    };

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 19000, 3000, 5000, 2000, 3000], // Mock data
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.5)',
                tension: 0.4
            }
        ]
    };

    const propertyData = {
        labels: ['Apartment', 'Villa', 'Office', 'Shop'],
        datasets: [
            {
                label: 'Properties',
                data: [12, 19, 3, 5], // Mock data
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
                borderWidth: 0
            }
        ]
    };

    if (loading) return <div className="text-center text-gray-400">Loading Dashboard...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard icon={Building2} label="Properties" value={stats.properties} color="bg-blue-500" />
                <StatsCard icon={FileText} label="Contracts" value={stats.contracts} color="bg-purple-500" />
                <StatsCard icon={DollarSign} label="Revenue" value={`$${stats.revenue}`} color="bg-green-500" />
                <StatsCard icon={Users} label="Clients" value={stats.clients} color="bg-orange-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-dark-800 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-4">Revenue Trends</h3>
                    <Line options={chartOptions} data={revenueData} />
                </div>
                <div className="bg-dark-800 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-4">Property Distribution</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut
                            data={propertyData}
                            options={{
                                plugins: {
                                    legend: { position: 'right', labels: { color: '#9ca3af' } }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-dark-800 p-6 rounded-xl border border-gray-800 flex items-center gap-4 hover:border-gray-600 transition-colors">
            <div className={`p-3 rounded-lg ${color} bg-opacity-20 text-${color.split('-')[1]}-500`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}
