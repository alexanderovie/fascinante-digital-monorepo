import NotFound from "@/components/NotFound";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: locale === 'es' ? '404 Página no encontrada' : '404 Page Not Found',
  };
}

const NotFoundPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  await params; // Consume params for async

  return (
    <>
      <NotFound />
    </>
  );
};

export default NotFoundPage;
