import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import {
    DollarSign, Plus, Download, Eye, Trash2, Calendar,
    FileText, CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react';

export default function Finance() {
    const { t } = useLanguage();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('/finance/');
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = async (invoice) => {
        setDownloadingId(invoice.id);
        try {
            const response = await axios.get(`/finance/${invoice.id}/download_pdf/`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${invoice.invoice_number}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(t('حدث خطأ أثناء تحميل الفاتورة', 'Error downloading invoice'));
        } finally {
            setDownloadingId(null);
        }
    };

    const deleteInvoice = async (id) => {
        if (!confirm(t('هل أنت متأكد من حذف هذه الفاتورة؟', 'Are you sure you want to delete this invoice?'))) return;
        try {
            await axios.delete(`/finance/${id}/`);
            setInvoices(invoices.filter(inv => inv.id !== id));
        } catch (error) {
            alert(t('حدث خطأ أثناء الحذف', 'Error deleting invoice'));
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            PAID: {
                label: t('مدفوعة', 'Paid'),
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
                icon: CheckCircle
            },
            PENDING: {
                label: t('معلقة', 'Pending'),
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                border: 'border-amber-200',
                icon: Clock
            },
            OVERDUE: {
                label: t('متأخرة', 'Overdue'),
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                icon: AlertCircle
            },
            CANCELLED: {
                label: t('ملغاة', 'Cancelled'),
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                border: 'border-gray-200',
                icon: XCircle
            }
        };
        return configs[status] || configs.PENDING;
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
                        {t('المالية والفواتير', 'Finance & Invoices')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('إدارة الفواتير والمدفوعات', 'Manage invoices and payments')}
                    </p>
                </div>
                <Link
                    to="/finance/new"
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-lg shadow-violet-600/30"
                >
                    <Plus size={20} />
                    {t('إضافة فاتورة', 'Add Invoice')}
                </Link>
            </div>

            {/* Invoices Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {invoices.map((invoice) => {
                    const statusConfig = getStatusConfig(invoice.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <div key={invoice.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <FileText className="text-violet-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {t('فاتورة', 'Invoice')} #{invoice.invoice_number}
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
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{t('المبلغ الأساسي', 'Amount')}:</span>
                                    <span className="font-semibold text-gray-900">{parseFloat(invoice.amount).toLocaleString()} {t('ريال', 'SAR')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{t('الضريبة', 'Tax')} ({parseFloat(invoice.tax_rate)}%):</span>
                                    <span className="font-semibold text-gray-900">{parseFloat(invoice.tax_amount).toLocaleString()} {t('ريال', 'SAR')}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-gray-700 font-semibold">{t('الإجمالي', 'Total')}:</span>
                                    <span className="text-xl font-bold text-violet-600">{parseFloat(invoice.total_amount).toLocaleString()} {t('ريال', 'SAR')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span>{t('تاريخ الاستحقاق', 'Due Date')}: {new Date(invoice.due_date).toLocaleDateString('ar-SA')}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => downloadPdf(invoice)}
                                    disabled={downloadingId === invoice.id}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-2.5 rounded-xl transition-colors font-medium disabled:opacity-50"
                                >
                                    {downloadingId === invoice.id ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                            {t('جاري التحميل...', 'Downloading...')}
                                        </>
                                    ) : (
                                        <>
                                            <Download size={18} />
                                            {t('تحميل PDF', 'Download PDF')}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => deleteInvoice(invoice.id)}
                                    className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl transition-colors font-medium"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {invoices.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                    <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {t('لا توجد فواتير', 'No invoices found')}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {t('ابدأ بإضافة فاتورتك الأولى', 'Start by adding your first invoice')}
                    </p>
                    <Link
                        to="/finance/new"
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all font-medium"
                    >
                        <Plus size={20} />
                        {t('إضافة فاتورة', 'Add Invoice')}
                    </Link>
                </div>
            )}
        </div>
    );
}
