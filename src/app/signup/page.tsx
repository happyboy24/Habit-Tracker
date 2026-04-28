import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9f4] px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#066735] text-xl tracking-[-1px] font-bold text-white shadow-[0_12px_28px_rgba(15,139,141,0.24)]">
              <span className="text-2xl text-[#d0d5dd]">H</span>T
            </div>
            <p className="text-sm font-bold uppercase text-[#0B4F51] tracking-[6px]">
              Habit Tracker
            </p>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[#123524]">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            Start tracking your daily habits with simple, consistent progress.
          </p>
        </div>

        <SignupForm />

        <p className="mt-6 text-center text-sm text-[#667085]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#066735]">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
