import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Download, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Finance() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/finance/');
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Finance & Invoices</h1>
                <Link
                    to="/finance/new"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Create Invoice
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-800 p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <h3 className="text-gray-400 font-medium">Total Revenue</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">$124,500</p>
                </div>
                {/* Add more stats here */}
            </div>

            <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-dark-700 text-gray-400">
                        <tr>
                            <th className="p-4">Invoice ID</th>
                            <th className="p-4">Contract</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-dark-700/50 transition-colors">
                                <td className="p-4 text-gray-400">#{invoice.id}</td>
                                <td className="p-4 text-white">Contract #{invoice.contract}</td>
                                <td className="p-4 text-white font-bold">${invoice.amount}</td>
                                <td className="p-4 text-gray-400">{invoice.due_date}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${invoice.status === 'PAID' ? 'bg-green-500/20 text-green-500' :
                                            invoice.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-red-500/20 text-red-500'
                                        }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {invoice.pdf_file && (
                                        <a
                                            href={invoice.pdf_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <Download size={20} />
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
