import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contracts() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await api.get('/contracts/');
            setContracts(response.data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Contracts</h1>
                <Link
                    to="/contracts/new"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    New Contract
                </Link>
            </div>

            <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-dark-700 text-gray-400">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Property</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {contracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-dark-700/50 transition-colors">
                                <td className="p-4 text-gray-400">#{contract.id}</td>
                                <td className="p-4 text-white font-medium">Property #{contract.property}</td>
                                <td className="p-4 text-gray-300">Client #{contract.client}</td>
                                <td className="p-4 text-gray-400">
                                    {contract.start_date} - {contract.end_date}
                                </td>
                                <td className="p-4 text-white font-bold">${contract.amount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${contract.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                        }`}>
                                        {contract.is_active ? 'Active' : 'Expired'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {contract.pdf_file && (
                                        <a
                                            href={contract.pdf_file}
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
                {contracts.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">No contracts found.</div>
                )}
            </div>
        </div>
    );
}
