import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

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
import { emailSchema } from "@/utils/validation";

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const superadminEmail = "shevaazki6@gmail.com";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    try {
      const subject = encodeURIComponent("Request Reset Password - Sejajar CMS");
      const body = encodeURIComponent(
        `Halo Superadmin,\n\nSaya ingin mengajukan permintaan untuk mereset kata sandi akun Sejajar CMS saya.\n\nEmail Akun: ${data.email}\n\nMohon bantuannya untuk memproses reset password akun ini.\n\nTerima kasih.`
      );
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${superadminEmail}&su=${subject}&body=${body}`;
      
      toast.success("Membuka Gmail untuk mengirim permintaan...");
      
      // Open the Gmail compose link via DOM click in a new tab to avoid mutating global window object directly
      const mailLink = document.createElement("a");
      mailLink.href = gmailUrl;
      mailLink.target = "_blank";
      mailLink.click();
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Card className="shadow-none border-none bg-white-logo">
        <CardHeader className="pb-8">
          <CardTitle className="text-center text-3xl">
            Forgot <span className="text-red-logo">Password</span>
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your email to request a password reset
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-1">Centralized Administration</span>
              CMS menggunakan manajemen akun terpusat. Permintaan reset password akan diteruskan langsung ke Superadmin melalui email.
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email-spacing" className="font-normal">
                Your Account Email
              </Label>
              <Input
                id="email-spacing"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-xs text-red-650 mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full hover:bg-red-logo flex items-center justify-center gap-2 mt-2"
              disabled={isSubmitting}
            >
              <Mail className="w-4 h-4" />
              {isSubmitting ? "Processing..." : "Kirim Permintaan Reset"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Link
            to="/login"
            className="w-full text-center inline-block text-sm underline-offset-4 hover:underline font-normal hover:text-red-logo"
          >
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
