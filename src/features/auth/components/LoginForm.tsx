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
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function LoginForm() {
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
          <form>
            <div className="flex flex-col gap-6">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-spacing" className="font-normal">
                    Password
                  </Label>
                </div>
                <Input id="password-spacing" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <FieldGroup className="pb-3">
            <Field orientation="horizontal">
              <Checkbox
                id="terms-checkbox-basic"
                name="terms-checkbox-basic"
                className="border data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
              <FieldLabel
                htmlFor="terms-checkbox-basic"
                className="font-normal"
              >
                Remember for 30 days
              </FieldLabel>
            </Field>
          </FieldGroup>
          <Link to="/dashboard/superadmin" className="w-full">
            <Button type="submit" className="w-full hover:bg-red-logo">
              Login
            </Button>
          </Link>
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
