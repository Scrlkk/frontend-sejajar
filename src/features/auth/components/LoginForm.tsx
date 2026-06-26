import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginSchemaType } from "@/features/auth/validation/loginSchema";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem("remembered_email") || "",
      password: "",
      rememberMe: !!localStorage.getItem("remembered_email"),
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    setLoginError(null);
    setIsSubmitting(true);
    try {
      // Save or clear email & storage preference based on rememberMe checkbox
      if (values.rememberMe) {
        localStorage.setItem("remembered_email", values.email);
        localStorage.setItem("use_local_storage", "true");
      } else {
        localStorage.removeItem("remembered_email");
        localStorage.removeItem("use_local_storage");
      }

      const user = await login({ email: values.email, password: values.password });
      
      toast.success("Login berhasil!");
      
      switch (user.role) {
        case "superadmin":
          navigate("/dashboard/superadmin");
          break;
        case "admin_social_media":
          navigate("/dashboard/social-media");
          break;
        case "content_lead":
          navigate("/dashboard/content-lead");
          break;
        case "owner":
          navigate("/dashboard/owner");
          break;
        case "script_writer":
          navigate("/dashboard/script-writer");
          break;
        case "content_editor":
          navigate("/dashboard/content-editor");
          break;
        default:
          navigate("/dashboard/content-editor");
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      let msg = "Email atau password salah";
      
      if (axios.isAxiosError<{ message?: string; error?: string }>(err)) {
        const responseData = err.response?.data;
        const status = err.response?.status;
        
        if (status === 429) {
          msg = typeof responseData === "string" 
            ? responseData 
            : responseData?.message || "Terlalu banyak percobaan login. Silakan coba lagi nanti.";
        } else if (typeof responseData === "object" && responseData?.message === "User account is inactive") {
          msg = "Akun Anda telah dinonaktifkan. Silakan hubungi administrator.";
        } else if (typeof responseData === "object" && responseData?.message === "User has no assigned role") {
          msg = "Akun Anda belum memiliki role akses. Silakan hubungi administrator.";
        } else if (status === 401 || (typeof responseData === "object" && responseData?.message === "Invalid credentials")) {
          msg = "Email atau password salah";
        } else if (typeof responseData === "object" && responseData?.message) {
          msg = responseData.message;
        } else if (err.message && !err.message.includes("Request failed")) {
          msg = err.message;
        }
      } else if (err instanceof Error && !err.message.includes("Request failed")) {
        msg = err.message;
      }
      
      setLoginError(msg);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Card className=" shadow-none border-none bg-white-logo">
        <CardHeader className="pb-12">
          <CardTitle className="text-center text-3xl">
            Welcome<span className="text-red-logo"> User </span>
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <div className="mb-6 p-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm text-center font-medium animate-in fade-in zoom-in-95 duration-200">
              {loginError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email-spacing" className="font-normal">
                  Email
                </Label>
                <Input
                  id="email-spacing"
                  type="email"
                  placeholder="account@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-spacing" className="font-normal">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password-spacing"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer flex items-center justify-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full mt-4 hover:bg-red-logo">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 mt-2">
          <FieldGroup className="pb-3">
            <Field orientation="horizontal">
              <Controller
                control={control}
                name="rememberMe"
                render={({ field }) => (
                  <Checkbox
                    id="terms-checkbox-basic"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                )}
              />
              <FieldLabel htmlFor="terms-checkbox-basic" className="font-normal">
                Remember for 30 days
              </FieldLabel>
            </Field>
          </FieldGroup>
          <Link
            to="/forgot-password"
            className="text-center inline-block text-sm underline-offset-4 hover:underline font-normal hover:text-red-logo"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
