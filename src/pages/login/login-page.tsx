import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks";
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui";

const authSchema = z
  .object({
    email: z.email("Insira um email válido"),
    password: z.string().min(7, "A senha deve ter mais de 6 caracteres"),
    confirmPassword: z.string(),
    mode: z.enum(["signin", "signup"]),
  })
  .refine((data) => data.mode === "signin" || data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.mode === "signin" || data.confirmPassword.length > 0, {
    message: "Confirme sua senha",
    path: ["confirmPassword"],
  });

type AuthFormData = z.infer<typeof authSchema>;

export function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", mode: "signin" },
  });

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setValue("mode", newMode);
    reset({ email: "", password: "", confirmPassword: "", mode: newMode });
  };

  const toggleMode = () => {
    switchMode(mode === "signin" ? "signup" : "signin");
  };

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(data.email, data.password);
        toast.success("Welcome back!");
      } else {
        await signUp(data.email, data.password);
        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl" role="img" aria-label="movie">
              🎬
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              CineDash
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Your personal movie dashboard
          </p>
        </div>

        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="mb-2 flex rounded-lg bg-gray-800/60 p-1">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  mode === "signin"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  mode === "signup"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
            <CardTitle className="text-xl text-white">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Enter your credentials to access your dashboard"
                : "Enter your details to get started"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirmar senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-gray-400">
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
