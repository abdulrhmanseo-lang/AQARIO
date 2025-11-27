import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { Upload, X, Calendar, DollarSign, FileText, Building2, User } from 'lucide-react';

export default function ContractForm() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [clients, setClients] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [formData, setFormData] = useState({
        property: '',
        client: '',
        start_date: '',
        end_date: '',
        monthly_amount: '',
        total_amount: '',
        status: 'ACTIVE',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [propsRes, clientsRes] = await Promise.all([
                axios.get('/properties/'),
                axios.get('/clients/')
            ]);
            setProperties(propsRes.data);
            setClients(clientsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            alert(t('يرجى اختيار ملف PDF فقط', 'Please select a PDF file only'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            if (pdfFile) {
                data.append('pdf_file', pdfFile);
            }

            await axios.post('/contracts/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(t('تم إضافة العقد بنجاح', 'Contract added successfully'));
            navigate('/contracts');
        } catch (error) {
            console.error('Error creating contract:', error);
            alert(t('حدث خطأ أثناء إضافة العقد', 'Error creating contract'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t('إضافة عقد جديد', 'Add New Contract')}
                </h1>
                <p className="text-gray-500 mt-1">
                    {t('أدخل تفاصيل العقد وارفع ملف PDF', 'Enter contract details and upload PDF file')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property & Client Selection */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Building2 size={20} className="text-violet-600" />
                        {t('العقار والعميل', 'Property & Client')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('العقار', 'Property')} *
                            </label>
                            <select
                                name="property"
                                value={formData.property}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            >
                                <option value="">{t('اختر العقار', 'Select Property')}</option>
                                {properties.map(prop => (
                                    <option key={prop.id} value={prop.id}>
                                        {prop.title} - {prop.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('العميل', 'Client')} *
                            </label>
                            <select
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            >
                                <option value="">{t('اختر العميل', 'Select Client')}</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} - {client.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contract Dates */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={20} className="text-violet-600" />
                        {t('تواريخ العقد', 'Contract Dates')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('تاريخ البداية', 'Start Date')} *
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('تاريخ الانتهاء', 'End Date')} *
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
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
                                {t('القيمة الشهرية', 'Monthly Amount')} *
                            </label>
                            <input
                                type="number"
                                name="monthly_amount"
                                value={formData.monthly_amount}
                                onChange={handleChange}
                                required
                                step="0.01"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('القيمة الإجمالية', 'Total Amount')} *
                            </label>
                            <input
                                type="number"
                                name="total_amount"
                                value={formData.total_amount}
                                onChange={handleChange}
                                required
                                step="0.01"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>
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
                            <option value="ACTIVE">{t('نشط', 'Active')}</option>
                            <option value="EXPIRED">{t('منتهي', 'Expired')}</option>
                            <option value="TERMINATED">{t('ملغي', 'Terminated')}</option>
                        </select>
                    </div>
                </div>

                {/* PDF Upload */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText size={20} className="text-violet-600" />
                        {t('ملف العقد', 'Contract File')}
                    </h2>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 transition-colors">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-700 font-medium mb-2">
                                {pdfFile ? pdfFile.name : t('اضغط لرفع ملف PDF', 'Click to upload PDF file')}
                            </p>
                            <p className="text-sm text-gray-500">
                                {t('PDF فقط، حجم أقصى 10MB', 'PDF only, max 10MB')}
                            </p>
                        </label>
                        {pdfFile && (
                            <button
                                type="button"
                                onClick={() => setPdfFile(null)}
                                className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                                {t('إزالة الملف', 'Remove file')}
                            </button>
                        )}
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
                        {loading ? t('جاري الحفظ...', 'Saving...') : t('حفظ العقد', 'Save Contract')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/contracts')}
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold"
                    >
                        {t('إلغاء', 'Cancel')}
                    </button>
                </div>
            </form>
        </div>
    );
}
