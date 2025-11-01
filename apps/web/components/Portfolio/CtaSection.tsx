import type { Locale } from '@/lib/i18n';
import Link from 'next/link';

interface CtaSectionProps {
  locale: Locale;
}

export function CtaSection({ locale }: CtaSectionProps) {
  return (
    <section className="py-12">
      <div className="relative bg-gradient-to-r from-primary to-darkPrimary rounded-md p-8 md:p-12 text-center">
        <div className="relative z-10 flex flex-col gap-4 items-center">
          <h2 className="text-white">
            ¿Listo para Crecimiento Real?
          </h2>
          <p className="text-white/90 text-lg max-w-2xl">
            Construyamos una marca que los clientes recuerdan, los algoritmos premian y la competencia no puede ignorar.
          </p>
          <Link
            href={`/${locale}/contact-us`}
            className="mt-4 py-3.5 px-8 bg-white hover:bg-gray-100 text-primary font-bold rounded-md transition-all duration-300"
          >
            Agenda tu Consultoría Gratis
          </Link>
        </div>
      </div>
    </section>
  );
}
