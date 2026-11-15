import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthAside } from "@/components/shared/AuthAside";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full">
      <AuthAside />

      <main className="flex w-full flex-col px-4 py-8 sm:px-6 lg:w-1/2 lg:px-16">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
