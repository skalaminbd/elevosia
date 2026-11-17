import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthAside } from "@/components/shared/AuthAside";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full">
      <AuthAside />

      <main className="flex w-full flex-col px-4 pt-4 pb-8 sm:px-6 lg:w-1/2 lg:px-16 lg:pt-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground lg:hidden"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-highlight font-heading text-base font-bold text-highlight-foreground">
              e
            </span>
            <span className="font-heading text-xl font-bold tracking-tight">
              elevosia
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex justify-center pt-25 pb-10">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
