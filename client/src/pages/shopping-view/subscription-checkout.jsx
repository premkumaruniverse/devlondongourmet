import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createNewSubscription } from "@/store/shop/subscription-slice";
import { fetchAllAddresses } from "@/store/shop/address-slice";
import { Check, Calendar, ArrowRight, ShieldCheck, MapPin, Info } from "lucide-react";
import Address from "@/components/shopping-view/address";

const SubscriptionCheckout = () => {
    const MapPinIcon = MapPin;
    const ShieldIcon = ShieldCheck;
    const CalendarIcon = Calendar;
    const InfoIcon = Info;
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useSelector((state) => state.auth);
    const { addressList } = useSelector((state) => state.shopAddress);

    // Get plan data from location state
    const planData = location.state?.plan || {
        name: "Starter",
        price: 59.00,
        frequency: "weekly",
        mealType: "Balanced Wellness",
        ritual: "Popular",
        startDate: "",
        endDate: ""
    };

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch, user]);

    const handleSubscribe = async () => {
        if (!selectedAddress) {
            toast({
                title: "Address Required",
                description: "Choose where your ritual should arrive.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        const subscriptionData = {
            productId: "66d86b7e6c3e3e3e3e3e3e3e", // Standard Ayu Bite Product ID
            frequency: planData.frequency || "weekly",
            price: parseFloat(planData.price),
            shippingAddress: selectedAddress,
            paymentMethodId: "mock_pm_123",
            metadata: {
                mealType: planData.mealType,
                ritual: planData.ritual,
                startDate: planData.startDate,
                endDate: planData.endDate,
                source: 'ayu_bite_ritual'
            }
        };

        const result = await dispatch(createNewSubscription(subscriptionData));

        if (result?.payload?.success) {
            toast({
                title: "Ritual Initiated",
                description: "Your health journey has officially begun.",
            });
            navigate("/shop/account");
        } else {
            toast({
                title: "Activation Failed",
                description: "The universe had a hiccup. Please try again.",
                variant: "destructive",
            });
        }
        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen bg-[#fcfaf7] dark:bg-[#0a0202] text-[#1a0505] dark:text-gray-100 pb-32 font-sans antialiased">
            {/* COMPACT HERO SECTION */}
            <div className="pt-32 pb-12 border-b border-stone-200 dark:border-white/5 relative overflow-hidden bg-white/50 dark:bg-transparent backdrop-blur-sm">
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-[2px] w-10 bg-amber-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[5px] text-amber-600 dark:text-amber-500 italic">Secure Protocol</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black italic tracking-tighter text-[#1a0505] dark:text-white leading-none">
                                Confirm Your <span className="text-amber-500">Ritual</span>
                            </h1>
                            <p className="text-xs font-medium text-stone-600 dark:text-gray-400 max-w-md leading-relaxed uppercase tracking-wider">
                                Finalizing your path to premium nourishment.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-[#1a0505] text-amber-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/10 italic">
                            <ShieldIcon className="w-4 h-4" /> SECURE ACTIVATION ACTIVE
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16 max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* CONFIGURATION COLUMN */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* DELIVERY SECTION */}
                        <section className="bg-white dark:bg-[#0c0303] rounded-[3rem] border-2 border-stone-200 dark:border-white/5 p-10 lg:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] dark:shadow-none relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.03),transparent)] pointer-events-none" />
                            
                            <div className="flex items-center gap-5 mb-10 relative z-10">
                                <div className="p-4 bg-amber-500 text-[#1a0505] rounded-2xl shadow-xl shadow-amber-500/20"><MapPinIcon className="w-6 h-6" /></div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a0505] dark:text-white">Delivery Coordinates</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500">Specify ritual destination</p>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <Address 
                                    selectedId={selectedAddress} 
                                    setCurrentSelectedAddress={setSelectedAddress} 
                                />
                            </div>
                        </section>

                        {/* SCHEDULE SECTION */}
                        <section className="bg-white dark:bg-[#0c0303] rounded-[3rem] border-2 border-stone-200 dark:border-white/5 p-10 lg:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="p-4 bg-amber-500 text-[#1a0505] rounded-2xl shadow-xl shadow-amber-500/20"><CalendarIcon className="w-6 h-6" /></div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a0505] dark:text-white">Manifestation Cycle</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500">Algorithmic timing sync</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-3 p-8 bg-stone-50 dark:bg-white/5 rounded-[2rem] border border-stone-100 dark:border-white/10">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#1a0505]/40 dark:text-white/40 italic">
                                        Sequence Start
                                    </div>
                                    <div className="text-2xl font-black text-[#1a0505] dark:text-white tracking-tighter tabular-nums">
                                        {planData.startDate || 'IMMEDIATE SYNC'}
                                    </div>
                                </div>
                                
                                {planData.frequency !== 'one-time' && planData.endDate && (
                                    <div className="space-y-3 p-8 bg-stone-50 dark:bg-white/5 rounded-[2rem] border border-stone-100 dark:border-white/10">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#1a0505]/40 dark:text-white/40 italic">
                                            Sequence Conclusion
                                        </div>
                                        <div className="text-2xl font-black text-[#1a0505] dark:text-white tracking-tighter tabular-nums">
                                            {planData.endDate}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="col-span-full p-8 bg-amber-500/5 dark:bg-amber-500/[0.03] rounded-[2rem] border border-amber-500/10 flex items-start gap-4">
                                    <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl">
                                        <InfoIcon className="w-5 h-5" />
                                    </div>
                                    <p className="text-[10px] font-bold text-stone-500 dark:text-gray-400 uppercase tracking-widest leading-loose">
                                        {planData.frequency === 'one-time'
                                            ? "SINGLE DELIVERY CYCLE: YOUR RITUAL PACK WILL BE EXECUTED ON THE SELECTED COORDINATE."
                                            : `EXTENDED RECURRING CYCLE: PRECISION DELIVERIES WILL COMMENCE FOR THE ENTIRE ${planData.frequency.toUpperCase()} PROTOCOL.`}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* MANIFESTATION SUMMARY SIDEBAR */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <Card className="bg-white dark:bg-[#1a0606] text-[#1a0505] dark:text-white rounded-[3.5rem] border-2 border-stone-200 dark:border-white/5 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] dark:shadow-none overflow-hidden transition-all duration-700">
                            <CardContent className="p-10 lg:p-12 relative">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full" />
                                
                                <h2 className="text-2xl font-black mb-10 pb-6 border-b border-stone-100 dark:border-white/5 uppercase tracking-tighter italic text-[#1a0505] dark:text-white">Manifestation</h2>

                                <div className="space-y-8 mb-12 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-amber-600 dark:text-amber-500 italic">Philosophy</span>
                                        <span className="text-lg font-black uppercase tracking-tight text-[#1a0505] dark:text-white">{planData.mealType}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-amber-600 dark:text-amber-500 italic">Structure</span>
                                        <span className="text-lg font-black uppercase tracking-tight text-[#1a0505] dark:text-white">{planData.ritual}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-amber-600 dark:text-amber-500 italic">Cycle</span>
                                        <span className="text-lg font-black uppercase tracking-tighter text-[#1a0505] dark:text-white">{planData.frequency.replace('-', ' ')}</span>
                                    </div>
                                    
                                    <div className="pt-10 border-t border-stone-100 dark:border-white/5 space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-[4px] text-stone-400 dark:text-gray-500 italic">Expected Total</span>
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-6xl font-black tracking-tighter tabular-nums drop-shadow-md text-[#1a0505] dark:text-white">£{planData.price}</span>
                                            <span className="text-[10px] font-black uppercase opacity-40 text-stone-400 dark:text-gray-500 tracking-widest leading-none">Recurring</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubscribe}
                                    className="w-full h-24 text-2xl font-black rounded-[2.5rem] bg-amber-500 hover:bg-amber-600 text-[#1a0505] transition-all duration-700 shadow-2xl shadow-amber-500/30 group uppercase tracking-widest border-none outline-none ring-offset-white dark:ring-offset-[#1a0606] focus:ring-2 focus:ring-amber-500"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "SYNCING..." : "ACTIVATE"} <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-4 transition-transform duration-700" />
                                </Button>

                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[3px] text-center mt-10 opacity-30 leading-relaxed italic">
                                    BY INITIALIZING, YOU COMMIT TO PRECISION VITALITY PROTOCOLS
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Button
                            variant="link"
                            onClick={() => navigate(-1)}
                            className="w-full mt-8 text-stone-400 dark:text-gray-600 hover:text-amber-500 transition-colors font-black uppercase tracking-[4px] text-[10px]"
                        >
                            <ArrowRight className="w-3 h-3 rotate-180 mr-2" /> Reorder Ritual Manifest
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCheckout;
