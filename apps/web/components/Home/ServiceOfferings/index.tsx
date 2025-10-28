import { services } from "@/app/api/services";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function ServiceOfferings() {
  return (
    <section>
      <div className="py-24 bg-[#F5F6F6]">
        <div className="flex flex-col gap-16">
          <div className="container">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="flex flex-col gap-4 max-w-xl">
                <div className="bg-gray w-fit flex-1 rounded-full py-1 px-4">
                  <p className="font-semibold text-white">What We Do Best</p>
                </div>
                <h2 className="font-semibold text-secondary">We create digital ecosystems that attract, convert, and retain</h2>
              </div>
              <div className="flex flex-col gap-8 max-w-sm">
                <p className="text-secondary">From SEO and local positioning to paid ads, web, and content — everything aligned for measurable growth.</p>
                <Link href="/services" className="w-fit text-secondary border-b-2 border-primary hover:text-primary">View all services</Link>
              </div>
            </div>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="flex gap-10">
              {services.map((value, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <div className="relative w-[440px] h-96">
                    <Link href={`/services/${value.slug}`}>
                      <Image
                        src={value.thumbnail_img}
                        alt="Image"
                        width={440}
                        height={390}
                        className="w-full h-full object-cover hover:scale-95 transition-transform duration-300 rounded-lg"
                      />
                    </Link>
                    <div className="absolute -bottom-8 right-0 flex items-center">
                      <div className="bg-white dark:bg-secondary pl-6 flex items-center rounded-sm">
                        <span className="text-secondary/40 mr-2">0{value.id}.</span>
                        <Link href={`/services/${value.slug}`}><h6 className="pr-10 font-semibold">{value.service_title}</h6></Link>
                        <Link
                          href={`/services/${value.slug}`}
                          className="w-fit bg-primary p-5 rounded-r-sm"
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
