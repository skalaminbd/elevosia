"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
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
import { FilterDisclosure } from "@/components/shared/FilterDisclosure";

const COVER_ICONS = {
  "Build vs buy": Scale,
  Operations: Workflow,
  "Client experience": MessagesSquare,
  "AI & automation": Sparkles,
  "Industry playbooks": Building2,
} as const;

const CATEGORY_BY_SLUG: Record<string, Category> = {
  "build-vs-buy": "Build vs buy",
  operations: "Operations",
  "client-experience": "Client experience",
  "ai-automation": "AI & automation",
  "industry-playbooks": "Industry playbooks",
};

const CATEGORY_OPTIONS = categories
  .filter((item): item is Exclude<Category, "All"> => item !== "All")
  .map((item) => ({ id: item, label: item, icon: COVER_ICONS[item] }));

/** Blog index: search, category filters, featured guide, animated grid. */
export function BlogIndex() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("category");
    if (!raw) return;
    const names = raw
      .split(",")
      .map((slug) => CATEGORY_BY_SLUG[slug])
      .filter((value): value is Category => Boolean(value));
    if (names.length === 0) return;
    const frame = window.requestAnimationFrame(() => setSelected(names));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function chooseCategories(next: string[]) {
    setSelected(next);
    const slugs = next
      .map(
        (name) =>
          Object.entries(CATEGORY_BY_SLUG).find(([, value]) => value === name)?.[0],
      )
      .filter((slug): slug is string => Boolean(slug));
    window.history.replaceState(
      null,
      "",
      slugs.length ? `/blog?category=${slugs.join(",")}` : "/blog",
    );
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        selected.length === 0 || selected.includes(post.category);
      const matchesQuery =
        needle.length === 0 ||
        post.title.toLowerCase().includes(needle) ||
        post.summary.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [query, selected]);

  const featured = posts.find((post) => post.published);
  const filtering = query.trim().length > 0 || selected.length > 0;
  const gridPosts = filtering
    ? filtered
    : filtered.filter((post) => post.slug !== featured?.slug);
  const firstSix = gridPosts.slice(0, 6);
  const rest = gridPosts.slice(6);

  return (
    <>
      <section className="relative overflow-x-clip">
        <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 md:pt-20 lg:px-8 lg:pt-24">
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

            <div className="mt-5 flex justify-center">
              <FilterDisclosure
                label="Filter"
                values={selected}
                options={CATEGORY_OPTIONS}
                onChange={chooseCategories}
              />
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden border-y border-border py-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          aria-hidden="true"
        >
          <div className="flex w-max gap-2 motion-safe:animate-[marquee-x_44s_linear_infinite]">
            {[...blogHero.topics, ...blogHero.topics].map((topic, index) => (
              <span
                key={`${topic}-${index}`}
                className="rounded-full border border-border px-3 py-1 font-mono text-[11px] whitespace-nowrap text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-15 sm:px-6 md:pb-20 lg:px-8 lg:pb-25">
        {!filtering && featured ? (
          <MagicCard
            className="rounded-lg border border-border bg-card"
            gradientFrom="var(--primary)"
            gradientTo="var(--success)"
            gradientOpacity={0.1}
          >
            <div className="grid md:grid-cols-12">
              <div className="order-2 flex flex-col p-6 md:order-1 md:col-span-7 lg:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-highlight px-2.5 py-1 text-[10px] font-semibold text-highlight-foreground">
                    Featured guide
                  </span>
                  <span className="text-xs font-medium text-success">
                    {featured.category}
                  </span>
                </div>
                <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  <Link href={`/blog/${featured.slug}`} className="hover:underline">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                  {featured.summary}
                </p>

                <ul className="mt-5 space-y-1.5">
                  {featured.takeaways?.slice(0, 3).map((takeaway) => (
                    <li
                      key={takeaway}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <Check
                        className="mt-0.5 size-3.5 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      {takeaway}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                  <span>{featured.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.readingTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>Alamin</span>
                </div>

                <div className="mt-6">
                  <ButtonLink href={`/blog/${featured.slug}`} variant="outline">
                    Read the guide
                  </ButtonLink>
                </div>
              </div>

              <div className="order-1 p-4 md:order-2 md:col-span-5 md:p-6">
                <div className="relative flex h-full min-h-48 items-center justify-center overflow-hidden rounded-md bg-secondary">
                  <span className="absolute inset-0 line-grid opacity-60" aria-hidden="true" />
                  <Workflow className="relative size-12 text-primary/50" aria-hidden="true" />
                  <span className="absolute right-3 bottom-3 font-mono text-[10px] text-muted-foreground">
                    01 / 12
                  </span>
                </div>
              </div>
            </div>
          </MagicCard>
        ) : null}

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {filtering
              ? `${filtered.length} of ${posts.length} guides`
              : `${posts.length - 1} more guides`}
          </p>
          {filtering ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                chooseCategories([]);
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {gridPosts.length === 0 && filtering ? (
          <div className="mt-4 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-base font-medium">No articles match that yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different word, or clear the filters to see every guide.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                chooseCategories([]);
              }}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : null}

        {firstSix.length > 0 ? (
          <motion.div
            layout={!reduceMotion}
            className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            <AnimatePresence initial={false}>
              {firstSix.map((post) => (
                <PostCard key={post.slug} post={post} reduceMotion={reduceMotion} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </div>

      <BlogBand />

      <div className="mx-auto w-full max-w-7xl px-4 py-15 sm:px-6 md:py-20 lg:px-8 lg:py-25">
        {rest.length > 0 ? (
          <motion.div
            layout={!reduceMotion}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            <AnimatePresence initial={false}>
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} reduceMotion={reduceMotion} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}

        <Newsletter />
      </div>
    </>
  );
}

function PostCard({
  post,
  reduceMotion,
}: {
  post: Post;
  reduceMotion: boolean;
}) {
  const Icon = COVER_ICONS[post.category];

  return (
    <motion.article
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/30"
    >
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-secondary">
        <span className="absolute inset-0 line-grid opacity-60" aria-hidden="true" />
        <Icon
          className="relative size-8 text-primary/60 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        />
        <span className="absolute top-3 left-3 rounded-full bg-card/80 px-2 py-0.5 text-[9px] font-medium text-muted-foreground backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          {post.published ? (
            <span className="font-mono text-[10px] text-muted-foreground">
              {post.readingTime}
            </span>
          ) : (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
              In progress
            </span>
          )}
          {post.published ? (
            <ArrowUpRight
              className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          ) : null}
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
    </motion.article>
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
    <div className="mx-auto mt-15 grid max-w-4xl gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-2 md:p-8 lg:mt-25">
      <div>
        <h3 className="font-heading text-xl font-semibold tracking-tight">
          {newsletter.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{newsletter.body}</p>
        <p className="mt-4 font-mono text-[10px] text-muted-foreground">
          One email a month · unsubscribe any time
        </p>
      </div>

      {sent ? (
        <div className="flex items-center rounded-md border border-success/30 bg-success/5 px-4 py-3">
          <p className="text-sm font-medium text-success">{newsletter.success}</p>
        </div>
      ) : (
        <form
          className="space-y-3"
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
          <Button type="submit" variant="outline" className="w-full">
            {newsletter.submit}
          </Button>
        </form>
      )}
    </div>
  );
}
