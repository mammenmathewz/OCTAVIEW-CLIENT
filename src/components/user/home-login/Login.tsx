import React, { useState } from "react";
import { Label } from "../../ui/Login_ui/label";
import { Input } from "../../ui/Login_ui/input";
import { cn } from "../../../lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../service/Api/userApis";
import { login } from "../../../service/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  companyName: string; 
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate, isPending, isError, error, data } = useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (data: LoginResponse) => {
      const { token, user } = data;
    
      dispatch(
        login({
          accessToken: token,
          userId: user.id,
          companyName: user.companyName,
        })
      );
    
      console.log("Login successful:", data);
      navigate("/dash"); // Navigate to the dashboard
    },
    
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: error.message || "An error occurred during login.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return; // Prevent multiple submissions
    mutate({ email, password });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
      <h2 className="font-bold text-xl text-neutral-800">Welcome to Octaview</h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="projectmayhem@fc.com"
            type="email"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            required
          />
        </LabelInputContainer>

        <button
          className={cn(
            "bg-gradient-to-br from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
            { "opacity-50 pointer-events-none": isPending }
          )}
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login →"}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8 h-[1px] w-full" />

        {/* Placeholder for Google login button */}
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 hover:bg-gray-100 transition duration-300"
          type="button"
          disabled={isPending}
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-800" />
          <span className="text-neutral-700 text-sm">Login with Google</span>
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
