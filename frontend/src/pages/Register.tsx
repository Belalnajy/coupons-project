import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-grey text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Join Waferlee
          </CardTitle>
          <CardDescription className="text-center text-light-grey">
            Create an account to start sharing deals
          </CardDescription>
          <div className="flex flex-row gap-2 mt-4">
            <Button className="flex-1 bg-darker-grey">Login</Button>
            <Button className="flex-1 bg-green">Register</Button>
          </div>
        </CardHeader>

        <form action={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  required
                  className="bg-darker-grey border-0"
                />
                <FieldError className="hidden">
                  Please enter a username
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-darker-grey border-0"
                />
                <FieldError className="hidden">
                  Please enter a valid email
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-darker-grey border-0"
                />
                <FieldError className="hidden">
                  Please enter a password
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  className="bg-darker-grey border-0"
                />
                <FieldError className="hidden">
                  Please enter a password
                </FieldError>
              </Field>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none"
                >
                  I agree to the{" "}
                  <a href="#" className="text-green hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-green hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-green hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <p className="text-center text-sm text-light-grey">
              Already have an account?{" "}
              <a href="/login" className="text-green hover:underline">
                Log in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
      <div className="max-w-md text-center">
        <p className="text-sm text-light-grey">
          By continuing, you agree to share deals responsibly and follow our
          community guidelines.
        </p>
      </div>
    </div>
  );
}
