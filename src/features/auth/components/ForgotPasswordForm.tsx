import { Link } from "react-router-dom";

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

export function ForgotPasswordForm() {
  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Card className="shadow-none border-none bg-white-logo">
        <CardHeader className="pb-12">
          <CardTitle className="text-center text-3xl">
            Forgot <span className="text-red-logo">Password</span>
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email below to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-2">
              <Label htmlFor="email-spacing" className="font-normal">
                Email
              </Label>
              <Input
                id="email-spacing"
                type="email"
                placeholder="account@example.com"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Link to="/reset-password" className="w-full">
            <Button type="submit" className="w-full hover:bg-red-logo">
              Submit
            </Button>
          </Link>
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
