import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ContractForm() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [clients, setClients] = useState([]); // In real app, fetch clients
    const [formData, setFormData] = useState({
        property: '',
        client: '', // Need a way to select client, for now manual ID or select
        start_date: '',
        end_date: '',
        amount: '',
        is_active: true
    });

    useEffect(() => {
        fetchProperties();
        // fetchClients();
    }, []);

    const fetchProperties = async () => {
        const res = await api.get('/properties/');
        setProperties(res.data);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contracts/', formData);
            navigate('/contracts');
        } catch (error) {
            console.error('Error creating contract:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/contracts')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
                <ArrowLeft size={20} />
                Back to Contracts
            </button>

            <div className="bg-dark-800 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-6">Create New Contract</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Property</label>
                        <select
                            name="property"
                            value={formData.property}
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            required
                        >
                            <option value="">Select Property</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Client ID (Demo)</label>
                        <input
                            type="number"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            required
                            placeholder="Enter Client User ID"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Create Contract
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
