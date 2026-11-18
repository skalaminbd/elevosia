"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Building2,
  Check,
  MessagesSquare,
  Scale,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";
import {
  blogBand,
  blogHero,
  categories,
  newsletter,
  posts,
  type Category,
  type Post,
} from "@/content/blog";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/ui/magic-card";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const COVER_ICONS = {
  "Build vs buy": Scale,
  Operations: Workflow,
  "Client experience": MessagesSquare,
  "AI & automation": Sparkles,
  "Industry playbooks": Building2,
} as const;

/** Blog index: search, category filters, featured guide, grid and the two bands. */
export function BlogIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        needle.length === 0 ||
        post.title.toLowerCase().includes(needle) ||
        post.summary.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const featured = posts.find((post) => post.published);
  const filtering = query.trim().length > 0 || category !== "All";
  const gridPosts = filtering
    ? filtered
    : filtered.filter((post) => post.slug !== featured?.slug);
  const firstSix = gridPosts.slice(0, 6);
  const rest = gridPosts.slice(6);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-10 sm:px-6 md:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{blogHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {blogHero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {blogHero.subhead}
            </p>

            <div className="relative mx-auto mt-8 max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={blogHero.searchPlaceholder}
                aria-label={blogHero.searchPlaceholder}
                className="h-11 pl-10 text-base"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    category === item
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-15 sm:px-6 md:pb-20 lg:px-8 lg:pb-25">
        {!filtering && featured ? (
          <MagicCard
            className="rounded-lg border border-border bg-card"
            gradientFrom="var(--primary)"
            gradientTo="var(--success)"
            gradientOpacity={0.1}
          >
            <div className="grid gap-6 p-6 md:grid-cols-12 md:items-center lg:p-8">
              <div className="md:col-span-4">
                <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-secondary">
                  {featured.category === "Operations" ? (
                    <Workflow className="size-10 text-primary/60" aria-hidden="true" />
                  ) : (
                    <Scale className="size-10 text-primary/60" aria-hidden="true" />
                  )}
                </div>
              </div>
              <div className="md:col-span-8">
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  {featured.category}
                </span>
                <h2 className="mt-4 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="hover:underline"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                  {featured.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{featured.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.readingTime}</span>
                </div>
                <div className="mt-5">
                  <ButtonLink href={`/blog/${featured.slug}`} variant="outline">
                    Read the guide
                  </ButtonLink>
                </div>
              </div>
            </div>
          </MagicCard>
        ) : null}

        {gridPosts.length === 0 && filtering ? (
          <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-base font-medium">No articles match that yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different word, or clear the filters to see every guide.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : null}

        {firstSix.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {firstSix.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}
      </div>

      <BlogBand />

      <div className="mx-auto w-full max-w-7xl px-4 py-15 sm:px-6 md:py-20 lg:px-8 lg:py-25">
        {rest.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}

        <Newsletter />
      </div>
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  const Icon = COVER_ICONS[post.category];

  const inner = (
    <>
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-t-lg bg-secondary">
        <span className="absolute inset-0 line-grid opacity-60" aria-hidden="true" />
        <Icon
          className="relative size-8 text-primary/60 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-success">{post.category}</span>
          {post.published ? (
            <span className="font-mono text-[10px] text-muted-foreground">
              {post.readingTime}
            </span>
          ) : (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
              In progress
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold">
          {post.published ? (
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          ) : (
            post.title
          )}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{post.summary}</p>
        <p className="mt-auto pt-4 font-mono text-xs text-muted-foreground">
          {post.date}
        </p>
      </div>
    </>
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      {inner}
    </article>
  );
}

function BlogBand() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <section
      ref={ref}
      className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {blogBand.title}
          </h2>
          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/70 dark:text-foreground/70">
            {blogBand.body}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className="flex size-6 items-center justify-center rounded-sm border border-primary-foreground/30 dark:border-border"
              >
                <motion.span
                  animate={alive ? { opacity: [0.3, 1, 1, 0.3] } : undefined}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    times: [0, index / 4 + 0.02, index / 4 + 0.22, 1],
                  }}
                >
                  <Check
                    className="size-3.5 text-highlight"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                </motion.span>
              </span>
            ))}
          </div>
          <ButtonLink
            href={blogBand.cta.href}
            className="bg-background text-foreground hover:bg-background/90"
          >
            {blogBand.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto mt-15 max-w-2xl rounded-lg border border-border bg-card p-6 md:p-8 lg:mt-25">
      <h3 className="font-heading text-xl font-semibold tracking-tight">
        {newsletter.title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{newsletter.body}</p>

      {sent ? (
        <p className="mt-5 rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success">
          {newsletter.success}
        </p>
      ) : (
        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!firstName.trim() || !email.trim()) return;
            setSent(true);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="newsletter-name" className="text-xs font-medium">
              {newsletter.fields.firstName}
            </Label>
            <Input
              id="newsletter-name"
              className="h-11"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newsletter-email" className="text-xs font-medium">
              {newsletter.fields.email}
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              inputMode="email"
              className="h-11"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="outline">
              {newsletter.submit}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
