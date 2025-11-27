import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Building2,
    FileText,
    Users,
    CreditCard,
    BarChart3,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden" dir="rtl">

            {/* Navigation Bar */}
            <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Building2 size={22} className="text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                عقاريّو
                            </span>
                            <span className="text-xs text-gray-500 block">Aqario</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-gray-400 hover:text-white font-medium transition-colors px-4 py-2 text-sm md:text-base"
                        >
                            تسجيل دخول
                        </Link>
                        <Link
                            to="/register"
                            className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-white/10 text-sm md:text-base"
                        >
                            ابدأ الآن
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Text Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 text-center lg:text-right"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-400 text-sm font-medium mb-8 backdrop-blur-sm mx-auto lg:mx-0">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                </span>
                                نظام إدارة العقارات الذكي
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-tight">
                                أدر عقاراتك <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
                                    بكل احترافية
                                </span>
                            </h1>

                            <p className="text-sm text-violet-400 mb-6">
                                نظام عقاري سحابي متكامل مخصص للسوق السعودي
                            </p>

                            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                منصة سحابية متكاملة تجمع كل ما تحتاجه شركتك العقارية. عقود إلكترونية، تحصيل مدفوعات، صيانة، وتقارير مالية دقيقة في مكان واحد.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Link
                                    to="/pricing"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-violet-600 rounded-full hover:bg-violet-500 hover:scale-105 shadow-xl shadow-violet-600/30"
                                >
                                    ابدأ الآن
                                    <ArrowLeft className="mr-2" size={20} />
                                </Link>

                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-transparent border border-white/20 rounded-full hover:bg-white/5"
                                >
                                    تسجيل الدخول
                                </Link>
                            </div>

                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span>تجربة مجانية 14 يوم</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span>لا يحتاج بطاقة ائتمان</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visual Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative rounded-2xl bg-gradient-to-b from-white/10 to-transparent p-1">
                                <div className="bg-[#0F0F0F] rounded-xl overflow-hidden shadow-2xl relative aspect-[4/3] group">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent"></div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-violet-600/20 rounded-lg text-violet-400">
                                                <BarChart3 size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">إحصائيات فورية</h3>
                                                <p className="text-gray-400">تابع أداء عقاراتك لحظة بلحظة</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10">
                                                <p className="text-gray-400 text-xs mb-1">إجمالي الإيرادات</p>
                                                <p className="text-2xl font-bold text-white">$124,500</p>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10">
                                                <p className="text-gray-400 text-xs mb-1">العقود النشطة</p>
                                                <p className="text-2xl font-bold text-emerald-400">+45</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-[#080808] relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            كل ما تحتاجه في مكان واحد
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            نظام متكامل يغطي كافة جوانب العمل العقاري
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Building2}
                            title="إدارة العقارات"
                            desc="سجل عقاراتك ووحداتك السكنية أو التجارية مع كافة التفاصيل والصور والمرافق."
                            color="text-violet-400"
                        />
                        <FeatureCard
                            icon={FileText}
                            title="العقود الإلكترونية"
                            desc="أنشئ عقود إيجار إلكترونية، وتابع تواريخ الانتهاء والتجديد تلقائياً."
                            color="text-blue-400"
                        />
                        <FeatureCard
                            icon={Users}
                            title="إدارة العملاء"
                            desc="قاعدة بيانات شاملة لعملائك مع سجل كامل للتعاملات والمدفوعات."
                            color="text-emerald-400"
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="المدفوعات والفواتير"
                            desc="نظام مالي متكامل لإصدار الفواتير ومتابعة التحصيل وحالات الدفع."
                            color="text-orange-400"
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="التقارير والإحصائيات"
                            desc="لوحة تحكم تفاعلية تعطيك نظرة شاملة على أداء عقاراتك وإيراداتك."
                            color="text-pink-400"
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="الأمان والحماية"
                            desc="نظام صلاحيات متقدم وتشفير كامل للبيانات لضمان أمان معلوماتك."
                            color="text-cyan-400"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Building2 size={20} className="text-white" />
                                </div>
                                <div>
                                    <span className="text-2xl font-bold text-white">عقاريّو</span>
                                    <span className="text-xs text-gray-500 block">Aqario</span>
                                </div>
                            </div>
                            <p className="text-gray-400 max-w-md leading-relaxed">
                                الشريك التقني الأمثل لشركات التطوير وإدارة الأملاك.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">روابط هامة</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">الرئيسية</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">المميزات</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">الأسعار</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">تواصل معنا</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li>info@aqario.com</li>
                                <li>+966 50 000 0000</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 text-center text-gray-600">
                        <p>© 2025 عقاريّو Aqario. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
    return (
        <div className="bg-[#0F0F0F] p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                <Icon className={color} size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}
