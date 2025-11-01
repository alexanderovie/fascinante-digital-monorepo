/**
 * MDXContent - Wrapper for MDX content
 * This is a Server Component that renders MDX content
 */
export function MDXContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-secondary dark:prose-headings:text-white prose-p:text-secondary dark:prose-p:text-white/80">
      {children}
    </div>
  );
}
