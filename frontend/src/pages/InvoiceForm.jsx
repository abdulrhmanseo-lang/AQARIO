import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function InvoiceForm() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [formData, setFormData] = useState({
        contract: '',
        amount: '',
        due_date: '',
        status: 'PENDING'
    });

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        const res = await api.get('/contracts/');
        setContracts(res.data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/finance/', formData);
            navigate('/finance');
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/finance')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
                <ArrowLeft size={20} />
                Back to Finance
            </button>

            <div className="bg-dark-800 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-6">Create New Invoice</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Contract</label>
                        <select
                            name="contract"
                            value={formData.contract}
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            required
                        >
                            <option value="">Select Contract</option>
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>Contract #{c.id} - ${c.amount}</option>
                            ))}
                        </select>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                        <input
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="OVERDUE">Overdue</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Create Invoice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
