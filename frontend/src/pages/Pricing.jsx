import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Building2, ArrowRight } from 'lucide-react';

export default function Pricing() {
    const plans = [
        {
            name: 'باقة الأساس',
            price: '799',
            period: 'سنوياً',
            features: [
                'لوحة تحكم أساسية',
                'عدد وحدات محدود',
                'نظام فواتير وتقارير',
                'دعم فني عبر البريد',
            ],
            gradient: 'from-blue-500 to-cyan-500',
            popular: false
        },
        {
            name: 'الباقة المتقدمة',
            price: '1599',
            period: 'سنوياً',
            features: [
                'جميع مميزات الأساس',
                'عقود إلكترونية PDF',
                'فريق مستخدمين متعدد',
                'تقارير متقدمة',
                'دعم فني ذو أولوية',
            ],
            gradient: 'from-violet-500 to-purple-500',
            popular: true
        },
        {
            name: 'باقة الشركات',
            price: '2999',
            period: 'سنوياً',
            features: [
                'كل الميزات بدون حدود',
                'Multi-Tenant + شركات فرعية',
                'تحصيل مالي متقدم',
                'تقارير وإحصائيات شاملة',
                'دعم فني مخصص 24/7',
                'تدريب الفريق',
            ],
            gradient: 'from-orange-500 to-red-500',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans" dir="rtl">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Building2 size={22} className="text-white" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                عقاريّو
                            </span>
                            <span className="text-xs text-gray-500 block">Aqario</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-400 hover:text-white font-medium transition-colors px-4 py-2">
                            تسجيل دخول
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            اختر الباقة المناسبة لك
                        </h1>
                        <p className="text-xl text-gray-400 mb-4">
                            حل عقاري سحابي متكامل لإدارة العقارات باحترافية
                        </p>
                        <p className="text-sm text-violet-400 mb-12">
                            ✨ نظام مصمم خصيصاً للسوق السعودي
                        </p>
                    </motion.div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative bg-[#0F0F0F] rounded-3xl p-8 border ${plan.popular ? 'border-violet-500/50 shadow-2xl shadow-violet-500/20' : 'border-white/5'
                                    } hover:border-white/10 transition-all`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-1.5 rounded-full text-sm font-bold">
                                        الأكثر شعبية
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-2 mb-2">
                                        <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-400">ريال</span>
                                    </div>
                                    <p className="text-gray-500">{plan.period}</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-right">
                                            <Check className="text-violet-400 flex-shrink-0 mt-1" size={20} />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/register"
                                    className={`block w-full py-4 rounded-full font-bold text-center transition-all ${plan.popular
                                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
                                            : 'bg-white/5 text-white hover:bg-white/10'
                                        }`}
                                >
                                    اشترك الآن
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#050505] border-t border-white/5 py-12 mt-20">
                <div className="container mx-auto px-6 text-center text-gray-600">
                    <p>© 2025 عقاريّو Aqario. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}
