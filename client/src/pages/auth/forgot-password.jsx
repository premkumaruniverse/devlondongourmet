import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import londonGourmetLogo from "@/assets/lg_logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    async function onSubmit(e) {
        e.preventDefault();
        if (!email.trim()) {
            toast({ title: "Please enter your email address.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const data = await dispatch(forgotPassword(email)).unwrap();
            // Always show success (API is intentionally non-enumerating)
            setSubmitted(true);
        } catch {
            toast({
                title: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <div className="relative rounded-2xl bg-card/60 backdrop-blur-xl border border-amber-500/20 dark:border-primary/30 shadow-[0_10px_40px_rgba(255,215,0,0.18)] p-8">
                <button 
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 text-stone-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition-all duration-300 group"
                    onClick={() => navigate("/auth/login")}
                >
                    <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 px-3 py-1 rounded-full shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all flex items-center gap-2">
                        <ArrowLeft className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                    </div>
                </button>
                {/* Decorative blobs */}
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-300/20 dark:bg-primary/20 blur-2xl" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-400/20 dark:bg-primary/20 blur-2xl" />

                {/* Logo */}
                <div className="mb-6 text-center">
                    <img src={londonGourmetLogo} alt="London Gourmet" className="h-14 w-auto mx-auto mb-4" />
                </div>

                {submitted ? (
                    /* ── Success state ── */
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="w-14 h-14 text-amber-600 dark:text-primary" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-playfair font-bold text-amber-700 dark:text-primary mb-3">
                            Check your inbox
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            If an account exists for <span className="font-medium text-foreground">{email}</span>,
                            we've sent a password reset link. It expires in <strong>1 hour</strong>.
                        </p>
                        <p className="text-xs text-muted-foreground mb-6">
                            Didn't get the email? Check your spam folder, or{" "}
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-amber-600 dark:text-primary hover:underline font-medium"
                            >
                                try again
                            </button>
                            .
                        </p>
                        <Link
                            to="/auth/login"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-700 dark:hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    /* ── Form state ── */
                    <>
                        <div className="mb-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="p-3 rounded-full bg-amber-100 dark:bg-primary/10">
                                    <Mail className="w-7 h-7 text-amber-600 dark:text-primary" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-playfair font-bold tracking-tight text-amber-700 dark:text-primary">
                                Forgot Password?
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Enter your email and we'll send you a reset link.
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-amber-300/60 dark:border-primary/30 focus-visible:ring-amber-500 dark:focus-visible:ring-primary"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-primary dark:hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/auth/login"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-700 dark:hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
