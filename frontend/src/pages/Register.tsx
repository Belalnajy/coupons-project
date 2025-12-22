import Snowfall from "react-snowfall";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
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

// Zod validation schema for registration form
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function Register() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const navigate = useNavigate();

  // Validate individual field on blur
  const handleBlur = (fieldName: keyof Omit<RegisterFormData, "terms" | "confirmPassword">, value: string) => {
    try {
      const fieldSchema = registerSchema.shape[fieldName];
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
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      terms: termsAccepted,
    };

    // Validate form data with Zod
    const validation = registerSchema.safeParse(formValues);

    if (!validation.success) {
      // Extract and set errors
      const fieldErrors: FormErrors = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof RegisterFormData;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // If validation passes, proceed with API call
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          username: validation.data.username,
          email: validation.data.email,
          password: validation.data.password,
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
      
      // Navigate to sign-in page on success
      navigate("/signin");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ email: "Registration failed. Please try again." });
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
              Join Waferlee
            </CardTitle>
            <CardDescription className="text-center text-light-grey">
              Create an account to start sharing deals
            </CardDescription>
            <div className="flex flex-row gap-2 mt-4">
              <Button 
                type="button"
                className="flex-1 bg-darker-grey cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Log In
              </Button>
              <Button 
                type="button"
                className="flex-1 bg-green cursor-pointer"
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
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    className="bg-darker-grey border-0"
                    onBlur={(e) => handleBlur("username", e.target.value)}
                    aria-invalid={!!errors.username}
                  />
                  {errors.username && (
                    <FieldError>{errors.username}</FieldError>
                  )}
                </Field>

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

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="bg-darker-grey border-0"
                    aria-invalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <FieldError>{errors.confirmPassword}</FieldError>
                  )}
                </Field>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(checked === true);
                      if (checked) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.terms;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none cursor-pointer"
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
                {errors.terms && (
                  <FieldError>{errors.terms}</FieldError>
                )}
              </FieldGroup>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-green hover:bg-primary/90 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
              <p className="text-center text-sm text-light-grey">
                Already have an account?{" "}
                <Link to="/signin" className="text-green hover:underline">
                  Log in
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
