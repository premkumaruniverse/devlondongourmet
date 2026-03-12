import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Calendar, ArrowRight, ShieldCheck, Zap, Heart, Leaf, Info, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";

const AyuBite = () => {
    const navigate = useNavigate();
    const configRef = useRef(null);
    const dispatch = useDispatch();
    const { productList, isLoading } = useSelector((state) => state.shopProducts);

    // Core Selection State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeFrequency, setActiveFrequency] = useState('weekly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ 
            filterParams: { includeAll: 'true' }, 
            sortParams: 'price-lowtohigh' 
        }));
    }, [dispatch]);

    useEffect(() => {
        if (productList && productList.length > 0 && !selectedProduct) {
            setSelectedProduct(productList[0]);
        }
    }, [productList, selectedProduct]);

    // Auto-calculate end date
    useEffect(() => {
        if (!startDate) {
            setEndDate('');
            return;
        }
        const start = new Date(startDate);
        let end = new Date(startDate);
        if (activeFrequency === 'weekly') {
            end.setDate(start.getDate() + 7);
            setEndDate(end.toISOString().split('T')[0]);
        } else if (activeFrequency === 'monthly') {
            end.setMonth(start.getMonth() + 1);
            setEndDate(end.toISOString().split('T')[0]);
        } else {
            setEndDate('');
        }
    }, [startDate, activeFrequency]);

    const calculatePrice = () => {
        if (!selectedProduct) return "0.00";
        let base = selectedProduct.price;
        const weeklyDiscount = selectedProduct.subscriptionOptions?.discounts?.weekly || 10;
        const monthlyDiscount = selectedProduct.subscriptionOptions?.discounts?.monthly || 20;

        if (activeFrequency === 'weekly') base *= (1 - weeklyDiscount / 100);
        if (activeFrequency === 'monthly') base *= (1 - monthlyDiscount / 100);

        return base.toFixed(2);
    };

    const handleGetStarted = () => {
        if (!selectedProduct) return;
        const finalPlan = {
            productId: selectedProduct._id,
            name: selectedProduct.title,
            mealType: "Ayu Bite Ritual",
            ritual: selectedProduct.title,
            frequency: activeFrequency,
            price: calculatePrice(),
            startDate,
            endDate: activeFrequency === 'one-time' ? startDate : endDate,
        };
        navigate('/shop/subscription-checkout', { state: { plan: finalPlan } });
    };

    if (isLoading) {
        return <div className="min-h-screen bg-white dark:bg-[#1a0505] flex items-center justify-center text-amber-500 font-bold uppercase tracking-widest">Manifesting Wisdom...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#140404] text-gray-900 dark:text-white pb-32 font-sans antialiased transition-colors duration-300">
            {/* HERO SECTION */}
            <div className="pt-32 pb-16 bg-white dark:bg-[#1a0606] border-b border-gray-200 dark:border-white/5">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-[3px] text-amber-500/60">The Daily Ritual</span>
                            </div>
                            <h1 className="text-7xl font-black italic tracking-tighter text-gray-900 dark:text-white">Ayu <span className="text-amber-500">Bites</span></h1>
                        </div>
                        <div className="max-w-md">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                Simplified nourishment for the modern life. Select your bite, schedule your cycle, and embrace the ritual of wellness.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-px bg-stone-200 dark:bg-white/5 border-2 border-stone-200 dark:border-white/10 rounded-[4rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] dark:shadow-none">

                    {/* LEFT SIDE: PRODUCT LIST */}
                    <div className="lg:col-span-5 bg-white dark:bg-[#1a0606] p-10 space-y-8 h-full">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-white/5">
                            <h2 className="text-xs font-black uppercase tracking-[3px] text-gray-500 dark:text-gray-400">SELECT YOUR MEAL</h2>
                            <span className="text-[10px] font-bold text-amber-500 tabular-nums">{productList?.length || 0} AVAILABLE</span>
                        </div>

                        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            {productList && productList.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`group cursor-pointer p-6 rounded-2xl flex items-center justify-between transition-all duration-300 border-2 ${selectedProduct?._id === product._id
                                            ? 'bg-amber-500 border-amber-500 text-black shadow-xl shadow-amber-500/20'
                                            : 'bg-stone-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-900 dark:text-white border-stone-100 dark:border-transparent hover:shadow-lg hover:border-amber-500/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${selectedProduct?._id === product._id ? 'bg-[#1a0505] scale-110' : 'bg-amber-500/40'}`} />
                                        <span className="font-black text-sm uppercase tracking-tight">{product.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-black ${selectedProduct?._id === product._id ? 'opacity-100' : 'opacity-40'}`}>£{product.price}</span>
                                        {selectedProduct?._id === product._id ? <ArrowRight className="w-4 h-4" /> : <div className="w-4 h-4 opacity-0 group-hover:opacity-40 group-hover:translate-x-1 transition-all"><ArrowRight className="w-4 h-4" /></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE: PRODUCT INFORMATION */}
                    <div className="lg:col-span-7 bg-stone-50/50 dark:bg-[#200808] p-12 lg:p-16 flex flex-col justify-between">
                        {selectedProduct ? (
                            <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8">
                                        <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                                        <span className="text-[9px] font-black uppercase tracking-[2px] text-amber-600 dark:text-amber-500 italic leading-none">Manifestation Protocol Active</span>
                                    </div>
                                    <h2 className="text-6xl font-black mb-8 italic tracking-tighter uppercase leading-[0.8] text-gray-900 dark:text-white underline decoration-amber-500/10 decoration-[10px] underline-offset-[-2px]">{selectedProduct.title}</h2>
                                    <p className="text-lg text-stone-500 dark:text-gray-400 font-medium leading-[1.8] max-w-xl italic">
                                        {selectedProduct.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 border-t border-stone-200 dark:border-white/10 pt-12 text-center md:text-left">
                                    <div className="space-y-4 p-8 bg-white dark:bg-white/[0.03] rounded-[2.5rem] border-2 border-stone-100 dark:border-white/5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-2xl hover:border-amber-500/10">
                                        <span className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500 italic">Initial Value</span>
                                        <div className="text-4xl font-black text-amber-600 dark:text-amber-500 tracking-tighter tabular-nums drop-shadow-sm">£{selectedProduct.price}</div>
                                    </div>
                                    <div className="space-y-4 p-8 bg-white dark:bg-white/[0.03] rounded-[2.5rem] border-2 border-stone-100 dark:border-white/5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-2xl hover:border-amber-500/10">
                                        <span className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500 italic">7-Day Save</span>
                                        <div className="text-4xl font-black text-[#1a0505] dark:text-white tracking-tighter tabular-nums drop-shadow-sm">{selectedProduct.subscriptionOptions?.discounts?.weekly || 10}%</div>
                                    </div>
                                    <div className="space-y-4 p-8 bg-white dark:bg-white/[0.03] rounded-[2.5rem] border-2 border-stone-100 dark:border-white/5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-2xl hover:border-amber-500/10">
                                        <span className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500 italic">30-Day Save</span>
                                        <div className="text-4xl font-black text-[#1a0505] dark:text-white tracking-tighter tabular-nums drop-shadow-sm">{selectedProduct.subscriptionOptions?.discounts?.monthly || 20}%</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                                <Sparkles className="w-12 h-12 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-[10px] ml-[10px]">Selection Required</span>
                            </div>
                        )}

                        {selectedProduct && (
                            <div className="mt-20 pt-12 border-t border-stone-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-[#1a0505]/30 dark:text-gray-600 italic">Expected Sequence Output</span>
                                    </div>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-6xl font-black tracking-tighter tabular-nums text-[#1a0505] dark:text-white drop-shadow-sm">£{calculatePrice()}</span>
                                        <span className="text-[10px] font-black uppercase opacity-30 text-stone-400 dark:text-gray-600 tracking-widest leading-none">/ ritual</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => configRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    className="h-20 px-12 rounded-[2rem] bg-[#1a0505] dark:bg-white/5 border-none hover:bg-black dark:hover:bg-white/10 text-amber-500 dark:text-white font-black uppercase tracking-[4px] transition-all shadow-2xl shadow-[#1a0505]/20 group"
                                >
                                    CONFIGURE RITUAL <ArrowRight className="ml-5 w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* SCHEDULING SECTION */}
                <div ref={configRef} className="mt-16 group animate-in slide-in-from-bottom-10 duration-700">
                    <div className="bg-white dark:bg-[#1a0606] p-12 lg:p-20 rounded-[5rem] border-2 border-stone-200 dark:border-white/10 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] dark:shadow-none space-y-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent)] pointer-events-none" />
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tight uppercase text-gray-900 dark:text-white">Define Your Cycle</h3>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-14">
                                <div className="grid grid-cols-3 p-3 bg-stone-50/80 dark:bg-[#140404] rounded-[2.5rem] gap-4 border-2 border-stone-100 dark:border-white/5 shadow-inner">
                                    {['one-time', 'weekly', 'monthly'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFrequency(f)}
                                            className={`py-8 rounded-[2rem] text-[10px] font-black uppercase tracking-[4px] transition-all duration-500 shadow-sm ${activeFrequency === f
                                                    ? "bg-amber-500 text-[#1a0505] shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] scale-105"
                                                    : "text-stone-400 hover:text-[#1a0505] dark:hover:text-white"
                                                }`}
                                        >
                                            {f.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[4px] text-stone-400 dark:text-gray-600 ml-4 italic">Initiate Sequence</Label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 transition-transform group-hover:rotate-12" />
                                            <Input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="h-20 rounded-[2rem] border-2 border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#140404] text-gray-900 dark:text-white px-16 focus:border-amber-500 focus:ring-0 transition-all font-black text-xs uppercase"
                                            />
                                        </div>
                                    </div>
                                    {activeFrequency !== 'one-time' && (
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-[4px] text-stone-400 dark:text-gray-600 ml-4 italic">Algorithmic Conclusion</Label>
                                            <div className="h-20 flex items-center px-10 bg-stone-50 dark:bg-[#140404] rounded-[2rem] border-2 border-stone-200 dark:border-white/5 border-dashed shadow-inner">
                                                <span className="text-xs font-black text-amber-600 dark:text-amber-500/60 transition-all duration-700 uppercase tracking-widest italic overflow-hidden whitespace-nowrap">
                                                    {startDate ? `Ends ${new Date(endDate).toLocaleDateString()}` : 'Awaiting Manifest...'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col justify-end">
                                <Card className="bg-amber-500/5 border border-amber-500/20 rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-none">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

                                    <div className="space-y-1">
                                        <h4 className="text-[9px] font-black uppercase tracking-[4px] text-amber-500 italic">Confirmation Path</h4>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Everything is properly aligned for your {activeFrequency} ritual.</p>
                                    </div>

                                    <Button
                                        onClick={handleGetStarted}
                                        disabled={!startDate || !selectedProduct}
                                        className="w-full h-24 text-xl font-black rounded-[2rem] bg-amber-500 hover:bg-amber-600 text-black uppercase tracking-widest shadow-2xl shadow-amber-500/10 group disabled:opacity-20 disabled:scale-95 transition-all outline-none border-none"
                                    >
                                        ACTIVATE RITUAL <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-4 transition-transform duration-500" />
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AyuBite;
