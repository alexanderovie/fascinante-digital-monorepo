import NotFound from "@/components/NotFound";
import type { Metadata } from "next";

// Next.js 15: not-found.tsx doesn't receive params in the same way
// This handles both direct navigation and RSC prefetch
export const metadata: Metadata = {
  title: "404 Página no encontrada | Fascinante Digital",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
