import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { DollarSign, Calendar, FileText, CheckCircle } from 'lucide-react';

export default function InvoiceForm() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        contract: '',
        invoice_number: '',
        amount: '',
        tax_rate: '15.00',
        due_date: '',
        status: 'PENDING',
        notes: ''
    });

    useEffect(() => {
        fetchContracts();
        generateInvoiceNumber();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await axios.get('/contracts/');
            setContracts(response.data.filter(c => c.status === 'ACTIVE'));
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    const generateInvoiceNumber = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        setFormData(prev => ({
            ...prev,
            invoice_number: `INV-${timestamp}-${random}`
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/finance/', formData);

            // Show success message
            setShowSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/finance');
            }, 2000);
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert(t('حدث خطأ أثناء إنشاء الفاتورة', 'Error creating invoice'));
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-16">
                <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-lg text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-emerald-600" size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {t('تم إنشاء الفاتورة بنجاح!', 'Invoice Created Successfully!')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('تم إرسال إشعار للعميل عبر البريد الإلكتروني وواتساب', 'Notification sent to client via email and WhatsApp')}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
                        {t('جاري التحويل...', 'Redirecting...')}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t('إضافة فاتورة جديدة', 'Add New Invoice')}
                </h1>
                <p className="text-gray-500 mt-1">
                    {t('أدخل تفاصيل الفاتورة', 'Enter invoice details')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Invoice Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText size={20} className="text-violet-600" />
                        {t('معلومات الفاتورة', 'Invoice Information')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('رقم الفاتورة', 'Invoice Number')} *
                            </label>
                            <input
                                type="text"
                                name="invoice_number"
                                value={formData.invoice_number}
                                onChange={handleChange}
                                required
                                readOnly
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('العقد', 'Contract')}
                            </label>
                            <select
                                name="contract"
                                value={formData.contract}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            >
                                <option value="">{t('اختر العقد (اختياري)', 'Select Contract (Optional)')}</option>
                                {contracts.map(contract => (
                                    <option key={contract.id} value={contract.id}>
                                        {contract.property?.title} - {contract.client?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Financial Details */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign size={20} className="text-violet-600" />
                        {t('التفاصيل المالية', 'Financial Details')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('المبلغ الأساسي', 'Amount')} *
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                step="0.01"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('نسبة الضريبة (%)', 'Tax Rate (%)')} *
                            </label>
                            <input
                                type="number"
                                name="tax_rate"
                                value={formData.tax_rate}
                                onChange={handleChange}
                                required
                                step="0.01"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('تاريخ الاستحقاق', 'Due Date')} *
                            </label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('الحالة', 'Status')}
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            >
                                <option value="PENDING">{t('معلقة', 'Pending')}</option>
                                <option value="PAID">{t('مدفوعة', 'Paid')}</option>
                                <option value="OVERDUE">{t('متأخرة', 'Overdue')}</option>
                                <option value="CANCELLED">{t('ملغاة', 'Cancelled')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('ملاحظات', 'Notes')}
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                        placeholder={t('أضف أي ملاحظات إضافية...', 'Add any additional notes...')}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3.5 rounded-xl transition-all font-semibold shadow-lg shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('جاري الحفظ...', 'Saving...') : t('حفظ الفاتورة', 'Save Invoice')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/finance')}
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold"
                    >
                        {t('إلغاء', 'Cancel')}
                    </button>
                </div>
            </form>
        </div>
    );
}
