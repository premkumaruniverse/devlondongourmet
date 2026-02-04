import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative rounded-2xl bg-card/60 backdrop-blur-xl border border-amber-500/20 dark:border-primary/30 shadow-[0_10px_40px_rgba(255,215,0,0.18)] p-8">
        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-300/20 dark:bg-primary/20 blur-2xl" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-400/20 dark:bg-primary/20 blur-2xl" />
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-playfair font-bold tracking-tight text-amber-700 dark:text-primary">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue
          </p>
        </div>
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
        <div className="mt-3 text-right">
          <Link to="/auth/forgot-password" className="text-sm text-amber-700 dark:text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <div className="h-px flex-1 bg-border" />
            <span>or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-primary dark:text-primary dark:hover:bg-primary/10">G</Button>
            <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-primary dark:text-primary dark:hover:bg-primary/10">f</Button>
            <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-primary dark:text-primary dark:hover:bg-primary/10"></Button>
          </div>
        </div>
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account</span>
          <Link to="/auth/register" className="ml-2 text-amber-700 dark:text-primary hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;
