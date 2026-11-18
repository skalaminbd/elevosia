"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CalendarDays, Check } from "lucide-react";
import { booking } from "@/content/book-a-call";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Day and time picker plus the short details form. */
export function BookingForm() {
  const router = useRouter();
  const [day, setDay] = useState(booking.days[2].id);
  const [time, setTime] = useState<string | null>("10:00 am");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");

  const selectedDay = booking.days.find((item) => item.id === day);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!time) {
      setError("Pick a time first.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Add your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Add a valid work email.");
      return;
    }
    setError("");
    router.push("/thank-you-call");
  }

  return (
    <Section id="booking">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
            {booking.title}
          </h2>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            {booking.intro}
          </p>

          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-semibold">Bring, if you can</p>
            <ul className="mt-3 space-y-2">
              {booking.bring.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            {booking.fallback.replace("hello@elevosia.com", "")}
            <a
              href="mailto:hello@elevosia.com"
              className="font-medium text-primary hover:underline"
            >
              hello@elevosia.com
            </a>
          </p>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="rounded-lg border border-border bg-card p-6 shadow-sm lg:p-8"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Choose a day</p>
              <span className="font-mono text-[10px] text-muted-foreground">
                US Eastern
              </span>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {booking.days.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDay(item.id)}
                  aria-pressed={day === item.id}
                  className={cn(
                    "rounded-md border py-2.5 text-center transition-colors",
                    day === item.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary/60",
                  )}
                >
                  <span className="block text-[10px] opacity-70">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium">
                    {item.date}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-5 text-sm font-semibold">Choose a time</p>
            <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {booking.times.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  aria-pressed={time === slot}
                  className={cn(
                    "min-h-10 rounded-md border text-xs font-medium transition-colors",
                    time === slot
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary/60",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-2 text-xs">
              <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
              {selectedDay && time ? (
                <span>
                  {selectedDay.label} {selectedDay.date} · {time} ET · 30 min
                </span>
              ) : (
                <span className="text-muted-foreground">Pick a day and time</span>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="booking-name" className="text-sm font-medium">
                  {booking.fields.name}
                </Label>
                <Input
                  id="booking-name"
                  className="h-11"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-email" className="text-sm font-medium">
                  {booking.fields.email}
                </Label>
                <Input
                  id="booking-email"
                  type="email"
                  inputMode="email"
                  className="h-11"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="booking-company" className="text-sm font-medium">
                  {booking.fields.company}
                </Label>
                <Input
                  id="booking-company"
                  className="h-11"
                  autoComplete="organization"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>
            </div>

            {error ? (
              <p className="mt-3 text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                {booking.submit}
                <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                {booking.note}
              </p>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
