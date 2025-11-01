/**
 * MDXContent - Wrapper for MDX content
 * This is a Server Component that renders MDX content
 * Styled to match ServicesDetail text content
 */
export function MDXContent({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
