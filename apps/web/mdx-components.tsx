import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';

/**
 * MDX Components - Global components for MDX files
 * This file allows you to provide custom React components
 * to be used in MDX files (case studies, blog posts, etc.)
 *
 * Reference: https://nextjs.org/docs/app/guides/mdx
 */
const components: MDXComponents = {
  // Customize built-in components
  h1: ({ children }) => (
    <h1 className="text-secondary dark:text-white font-semibold text-4xl md:text-5xl lg:text-6xl mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-semibold text-secondary dark:text-white mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-semibold text-secondary dark:text-white mt-6 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-semibold text-secondary dark:text-white mt-4 mb-2">
      {children}
    </h4>
  ),
  h6: ({ children }) => (
    <h6 className="font-semibold mb-4">
      {children}
    </h6>
  ),
  p: ({ children }) => (
    <p className="text-base md:text-lg text-secondary/80 dark:text-white/80 mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="flex flex-col gap-3 mb-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="flex flex-col gap-2 md:gap-3 mb-4">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="flex items-center gap-2 text-base md:text-lg text-secondary/80 dark:text-white/80">
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary hover:text-darkPrimary underline transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      className="rounded-md my-6"
      {...(props as ImageProps)}
    />
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-secondary dark:text-white/70">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
      {children}
    </code>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
