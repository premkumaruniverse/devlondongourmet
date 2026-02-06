import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  console.log(formData);

  const extendedControls = [
    ...registerFormControls,
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      componentType: "input",
      type: "password",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative rounded-2xl bg-card/60 backdrop-blur-xl border border-amber-500/20 dark:border-primary/30 shadow-[0_10px_40px_rgba(255,215,0,0.18)] p-8">
        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-300/20 dark:bg-primary/20 blur-2xl" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-400/20 dark:bg-primary/20 blur-2xl" />
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-playfair font-bold tracking-tight text-amber-700 dark:text-primary">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join London Gourmet
          </p>
        </div>
        <CommonForm
          formControls={extendedControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
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
          <span className="text-muted-foreground">Already have an account?</span>
          <Link to="/auth/login" className="ml-2 text-amber-700 dark:text-primary hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;
