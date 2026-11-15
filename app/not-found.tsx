import type { Metadata } from "next";
import { ErrorOne } from "@/components/kit/watermelon/error-one";

export const metadata: Metadata = {
  title: "Page not found — Elevosia",
};

export default function NotFound() {
  return <ErrorOne />;
}
