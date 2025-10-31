import { services } from "@/app/api/services";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toTitleCase } from '@/lib/utils/text-formatting';
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ServiceOfferingsProps {
  dict: {
    badge: string;
    title: string;
    description: string;
    viewAllServices: string;
    services: {
      digitalBranding: string;
      seoOptimization: string;
      googleMetaAds: string;
      webDesign: string;
      brandIdentity: string;
      emailAutomation: string;
    };
  };
}

function ServiceOfferings({ dict }: ServiceOfferingsProps) {
  // Override only the displayed titles, keep images/links intact
  const marketingTitles = [
    dict.services.digitalBranding,
    dict.services.seoOptimization,
    dict.services.googleMetaAds,
    dict.services.webDesign,
    dict.services.brandIdentity,
    dict.services.emailAutomation,
  ];
  return (
    <section>
      <div className="py-24 bg-[#F5F6F6] dark:bg-[#121212]">
        <div className="flex flex-col gap-16">
          <div className="container">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="flex flex-col gap-4 max-w-xl">
                <div className="badge">
                  <p className="text-current">{dict.badge}</p>
                </div>
                <h2 className="font-semibold text-secondary dark:text-white">{toTitleCase(dict.title)}</h2>
              </div>
              <div className="flex flex-col gap-8 max-w-sm">
                <p className="text-secondary dark:text-white/80">{dict.description}</p>
                <Link href="/services" className="w-fit text-secondary dark:text-white border-b-2 border-primary hover:text-primary">{dict.viewAllServices}</Link>
              </div>
            </div>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="flex gap-10">
              {services.map((value, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <div className="relative w-[440px] h-96">
                    {/* Imagen primero */}
                    <Link href={`/services/${value.slug}`}>
                      <Image
                        src={value.thumbnail_img}
                        alt={`${marketingTitles[index] ?? value.service_title} - Fascinante Digital`}
                        width={440}
                        height={390}
                        quality={70}
                        sizes="(max-width: 768px) 90vw, 440px"
                        className="w-full h-full object-cover hover:scale-95 transition-transform duration-300 rounded-lg"
                      />
                    </Link>
                    {/* Texto con icono después (abajo de la imagen) */}
                    <div className="absolute -bottom-8 right-0 flex items-center z-10">
                      <div className="bg-white dark:bg-secondary pl-6 flex items-center rounded-sm">
                        <span className="text-secondary/60 dark:text-white/60 mr-2">0{value.id}.</span>
                        <Link href={`/services/${value.slug}`}><h3 className="pr-10 font-semibold text-secondary dark:text-white">{marketingTitles[index] ?? value.service_title}</h3></Link>
                        <Link
                          href={`/services/${value.slug}`}
                          className="w-fit bg-primary py-3 px-6 rounded-r-sm flex items-center justify-center"
                          aria-label={`Ver servicio ${marketingTitles[index] ?? value.service_title}`}
                        >
                          <ArrowRight className="w-6 h-6 text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 m-3 border border-primary bg-primary cursor-pointer shadow-soft-primary" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 m-3 border border-primary bg-primary cursor-pointer shadow-soft-primary" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
export default ServiceOfferings;
