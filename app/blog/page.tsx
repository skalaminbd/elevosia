import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { PageClosing } from "@/components/shared/PageClosing";
import { blogClosing, blogMeta } from "@/content/blog";

export const metadata: Metadata = {
  title: blogMeta.title,
  description: blogMeta.description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: blogMeta.title,
    description: blogMeta.description,
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <BlogIndex />
        <PageClosing
          title={blogClosing.title}
          body={blogClosing.body}
          primary={blogClosing.primary}
          secondary={blogClosing.secondary}
        />
      </main>

      <SiteFooter />
    </>
  );
}
