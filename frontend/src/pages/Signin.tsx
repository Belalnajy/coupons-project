import Snowfall from "react-snowfall";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Zod validation schema for sign-in form
const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SigninFormData = z.infer<typeof signinSchema>;
type FormErrors = Partial<Record<keyof SigninFormData, string>>;

export default function Signin() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const navigate = useNavigate();

  // Validate individual field on blur
  const handleBlur = (fieldName: keyof SigninFormData, value: string) => {
    try {
      const fieldSchema = signinSchema.shape[fieldName];
      fieldSchema.parse(value);
      // Clear error if validation passes
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error.issues[0].message,
        }));
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const formValues = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate form data with Zod
    const validation = signinSchema.safeParse(formValues);

    if (!validation.success) {
      // Extract and set errors
      const fieldErrors: FormErrors = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof SigninFormData;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // If validation passes, proceed with API call
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(validation.data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      
      // Navigate to home page on success
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ email: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Snowfall color="#82C3D9" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md bg-grey text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-light-grey">
              Login to share deals and save your favorites
            </CardDescription>
            <div className="flex flex-row gap-2 mt-4">
              <Button 
                type="button"
                className="flex-1 bg-green cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Log In
              </Button>
              <Button 
                type="button"
                className="flex-1 bg-darker-grey cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <CardContent className="space-y-4">
              <FieldGroup className="gap-3">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className="bg-darker-grey border-0"
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <FieldError>{errors.email}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="bg-darker-grey border-0"
                    onBlur={(e) => handleBlur("password", e.target.value)}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <FieldError>{errors.password}</FieldError>
                  )}
                </Field>
                <Link to="/forgot-password" className="text-right text-sm text-green">
                  Forgot Password?
                </Link>
              </FieldGroup>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-green hover:bg-primary/90 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
              <p className="text-center text-sm text-light-grey">
                Don't have an account?{" "}
                <Link to="/register" className="text-green hover:underline">
                  Sign Up
                </Link>
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
    </>
  );
}
