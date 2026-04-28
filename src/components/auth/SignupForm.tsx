"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = signup(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="auth-signup-form"
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="auth-signup-email">Email</label>
        <input
          id="auth-signup-email"
          data-testid="auth-signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="relative">
        <label htmlFor="auth-signup-password">Password</label>
        <input
          id="auth-signup-password"
          data-testid="auth-signup-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full pr-10"
        />

        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 translate-y-1 text-gray-500 cursor-pointer"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        data-testid="auth-signup-submit"
        type="submit"
        className="bg-[#066735] font-mono font-bold text-white rounded-lg p-2 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      >
        Sign Up
      </button>
    </form>
  );
}
