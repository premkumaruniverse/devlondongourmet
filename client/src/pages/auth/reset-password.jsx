import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import londonGourmetLogo from "@/assets/lg_logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    // If no token in URL, show an error immediately
    const hasToken = Boolean(token);

    async function onSubmit(e) {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast({ title: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ title: "Passwords do not match.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const result = await dispatch(resetPassword({ token, newPassword })).unwrap();
            if (result.success) {
                setSuccess(true);
                setTimeout(() => navigate("/auth/login"), 3000);
            } else {
                toast({ title: result.message || "Password reset failed.", variant: "destructive" });
            }
        } catch (err) {
            toast({
                title: err?.message || "The reset link is invalid or has expired.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <div className="relative rounded-2xl bg-card/60 backdrop-blur-xl border border-amber-500/20 dark:border-primary/30 shadow-[0_10px_40px_rgba(255,215,0,0.18)] p-8">
                {/* Decorative blobs */}
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-300/20 dark:bg-primary/20 blur-2xl" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-400/20 dark:bg-primary/20 blur-2xl" />

                {/* Logo */}
                <div className="mb-6 text-center">
                    <img src={londonGourmetLogo} alt="London Gourmet" className="h-14 w-auto mx-auto mb-4" />
                </div>

                {/* No-token error */}
                {!hasToken && (
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-14 h-14 text-destructive" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-playfair font-bold text-amber-700 dark:text-primary mb-3">
                            Invalid Reset Link
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            This password reset link is invalid or missing. Please request a new one.
                        </p>
                        <Link
                            to="/auth/forgot-password"
                            className="inline-block bg-amber-600 hover:bg-amber-700 dark:bg-primary dark:hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-all text-sm"
                        >
                            Request New Link
                        </Link>
                    </div>
                )}

                {/* Success state */}
                {hasToken && success && (
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="w-14 h-14 text-amber-600 dark:text-primary" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-playfair font-bold text-amber-700 dark:text-primary mb-3">
                            Password Changed!
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            Your password has been reset successfully. Redirecting you to Sign In…
                        </p>
                        <Link
                            to="/auth/login"
                            className="inline-block bg-amber-600 hover:bg-amber-700 dark:bg-primary dark:hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-all text-sm"
                        >
                            Go to Sign In
                        </Link>
                    </div>
                )}

                {/* Form */}
                {hasToken && !success && (
                    <>
                        <div className="mb-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="p-3 rounded-full bg-amber-100 dark:bg-primary/10">
                                    <KeyRound className="w-7 h-7 text-amber-600 dark:text-primary" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-playfair font-bold tracking-tight text-amber-700 dark:text-primary">
                                Set New Password
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Choose a strong password for your account.
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-medium">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="pr-10 border-amber-300/60 dark:border-primary/30 focus-visible:ring-amber-500 dark:focus-visible:ring-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Repeat your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pr-10 border-amber-300/60 dark:border-primary/30 focus-visible:ring-amber-500 dark:focus-visible:ring-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        tabIndex={-1}
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password match indicator */}
                            {confirmPassword && (
                                <p
                                    className={`text-xs ${newPassword === confirmPassword
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-destructive"
                                        }`}
                                >
                                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-primary dark:hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Resetting…
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>

                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Remember your password?{" "}
                            <Link to="/auth/login" className="text-amber-700 dark:text-primary hover:underline ml-1">
                                Sign In
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
