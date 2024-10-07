import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getToken, TokenResponse } from "../api/auth";
import { useAuthDispatch } from "../contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const forwardURL = localStorage.getItem("url_before_login");

  const { register, handleSubmit } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    getToken({ username: data.email, password: data.password })
      .then((response: TokenResponse) => {
        dispatch({ type: "LOGIN", payload: response });
        localStorage.removeItem("url_before_login");
        navigate(forwardURL ?? "/home");
      })
      .catch(() => {
        toast("Login failed");
      });
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
