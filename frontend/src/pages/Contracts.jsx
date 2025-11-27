import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import {
    FileText, Plus, Download, Eye, Trash2, Calendar,
    Building2, User, DollarSign, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

export default function Contracts() {
    const { t } = useLanguage();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await axios.get('/contracts/');
            setContracts(response.data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteContract = async (id) => {
        if (!confirm(t('هل أنت متأكد من حذف هذا العقد؟', 'Are you sure you want to delete this contract?'))) return;
        try {
            await axios.delete(`/contracts/${id}/`);
            setContracts(contracts.filter(c => c.id !== id));
        } catch (error) {
            alert(t('حدث خطأ أثناء الحذف', 'Error deleting contract'));
        }
    };

    const downloadPdf = async (contract) => {
        if (!contract.pdf_file) {
            alert(t('لا يوجد ملف PDF لهذا العقد', 'No PDF file for this contract'));
            return;
        }

        try {
            const response = await axios.get(contract.pdf_file, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `contract_${contract.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert(t('حدث خطأ أثناء تحميل الملف', 'Error downloading file'));
        }
    };

    const viewPdf = (pdfUrl) => {
        if (!pdfUrl) {
            alert(t('لا يوجد ملف PDF لهذا العقد', 'No PDF file for this contract'));
            return;
        }
        setSelectedPdf(pdfUrl);
    };

    const getStatusConfig = (status) => {
        const configs = {
            ACTIVE: {
                label: t('نشط', 'Active'),
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
                icon: CheckCircle
            },
            EXPIRED: {
                label: t('منتهي', 'Expired'),
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                icon: XCircle
            },
            TERMINATED: {
                label: t('ملغي', 'Terminated'),
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                border: 'border-gray-200',
                icon: AlertCircle
            }
        };
        return configs[status] || configs.ACTIVE;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t('العقود', 'Contracts')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('إدارة عقود الإيجار والاتفاقيات', 'Manage rental contracts and agreements')}
                    </p>
                </div>
                <Link
                    to="/contracts/new"
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-lg shadow-violet-600/30"
                >
                    <Plus size={20} />
                    {t('إضافة عقد', 'Add Contract')}
                </Link>
            </div>

            {/* Contracts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {contracts.map((contract) => {
                    const statusConfig = getStatusConfig(contract.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <div key={contract.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <FileText className="text-violet-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {t('عقد رقم', 'Contract')} #{contract.id}
                                        </h3>
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} mt-1`}>
                                            <StatusIcon size={14} />
                                            {statusConfig.label}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Building2 size={16} className="text-gray-400" />
                                    <span className="text-sm">{contract.property?.title || t('عقار غير محدد', 'Property not specified')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <User size={16} className="text-gray-400" />
                                    <span className="text-sm">{contract.client?.name || t('عميل غير محدد', 'Client not specified')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-sm">
                                        {new Date(contract.start_date).toLocaleDateString('ar-SA')} - {new Date(contract.end_date).toLocaleDateString('ar-SA')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-violet-600 font-semibold">
                                    <DollarSign size={16} />
                                    <span>{parseFloat(contract.total_amount || 0).toLocaleString()} {t('ريال', 'SAR')}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                {contract.pdf_file && (
                                    <>
                                        <button
                                            onClick={() => viewPdf(contract.pdf_file)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-xl transition-colors font-medium"
                                        >
                                            <Eye size={18} />
                                            {t('عرض', 'View')}
                                        </button>
                                        <button
                                            onClick={() => downloadPdf(contract)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-2.5 rounded-xl transition-colors font-medium"
                                        >
                                            <Download size={18} />
                                            {t('تحميل', 'Download')}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => deleteContract(contract.id)}
                                    className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl transition-colors font-medium"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {contracts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                    <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {t('لا توجد عقود', 'No contracts found')}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {t('ابدأ بإضافة عقدك الأول', 'Start by adding your first contract')}
                    </p>
                    <Link
                        to="/contracts/new"
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium"
                    >
                        <Plus size={20} />
                        {t('إضافة عقد', 'Add Contract')}
                    </Link>
                </div>
            )}

            {/* PDF Viewer Modal */}
            {selectedPdf && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">
                                {t('عرض العقد', 'View Contract')}
                            </h3>
                            <button
                                onClick={() => setSelectedPdf(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={selectedPdf}
                                className="w-full h-full"
                                title="Contract PDF"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
