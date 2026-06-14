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

export function ResetPasswordForm() {
  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Card className="shadow-none border-none bg-white-logo">
        <CardHeader className="pb-12">
          <CardTitle className="text-center text-3xl">
            Reset <span className="text-red-logo">Password</span>
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password-spacing" className="font-normal">
                  New Password
                </Label>
                <Input
                  id="password-spacing"
                  type="password"
                  placeholder="new password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="confirm-password-spacing"
                    className="font-normal"
                  >
                    Confirm Password
                  </Label>
                </div>
                <Input
                  id="confirm-password-spacing"
                  type="password"
                  placeholder="confirm new password"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full hover:bg-red-logo">
            Submit
          </Button>
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
