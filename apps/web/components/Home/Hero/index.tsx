"use client";
import { API_ENDPOINTS } from '@/lib/api-config';
import type { Locale } from "@/lib/i18n";
import type { PlaceDetails } from "@/types/places";
import { ChevronRight, Clock, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import FormComponent from "./FormComponent";

interface HeroSectionProps {
  dict: Record<string, string>;
  locale: Locale;
}

function HeroSection({ dict, locale }: HeroSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const ref = useRef(null);
  const [formData, setFormData] = useState<{
    name: string;
    number: string;
    email: string;
    services: string[];
  }>({
    name: "", // Campo completamente vacío
    number: "",
    email: "",
    services: [],
  });


  useEffect(() => {
    if (submitted) {
      setShowThanks(true);
      const timer = setTimeout(() => {
        setShowThanks(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const reset = () => {
    setFormData({
      name: "",
      number: "",
      email: "",
      services: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading('Sending request...');

    fetch(API_ENDPOINTS.contact, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email || undefined,
        message: formData.services.length > 0 ? `Services requested: ${formData.services.join(", ")}` : "No services selected",
        service: "Hero Form"
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.dismiss(loadingToast);
          toast.success('Request sent successfully!', {
            description: "We'll contact you soon."
          });
          setSubmitted(data.success);
          reset();
        } else {
          throw new Error(data.error || 'Error al enviar solicitud');
        }
      })
      .catch((error) => {
        toast.dismiss(loadingToast);
        toast.error('Error sending request', {
          description: 'Please try again.'
        });
        console.log(error.message);
      });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNameChange = (value: string) => {
    // Asegurar que siempre sea un string limpio
    const cleanValue = value ? value.trim() : '';
    setFormData((prevData) => ({
      ...prevData,
      name: cleanValue
    }));
  };

  const handlePlaceSelect = (place: PlaceDetails) => {
    // Auto-completar datos del negocio si están disponibles
    setFormData((prevData) => ({
      ...prevData,
      name: place.name,
      // Puedes agregar más campos si los necesitas en el futuro
      // number: place.formatted_phone_number || prevData.number,
    }));

    // Opcional: mostrar información adicional
    if (place.formatted_address) {
      toast.success('Negocio encontrado', {
        description: place.formatted_address,
      });
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => {
      if (checked) {
        return { ...prevData, services: [...prevData.services, name] };
      } else {
        return { ...prevData, services: prevData.services.filter((service) => service !== name) };
      }
    });
  };

  return (
    <section>
      <div className="relative pt-24 lg:pt-32">
        <div className="bg-white h-full flex justify-center items-center">
          <div className="container">
            <div ref={ref} className="flex flex-col lg:flex-row gap-10 xl:gap-20 2xl:gap-32 py-20 items-center lg:items-center justify-between">
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-3">
                  <Link
                    href={`/${locale}/contact-us`}
                    className="badge"
                  >
                    {dict.badge} →
                    <ChevronRight className="ml-1 size-4 text-current" aria-hidden="true" />
                  </Link>
                  <h1 className="text-secondary dark:text-white font-semibold min-w-[12ch]">
                    {toTitleCase(dict.title)}
                  </h1>
                </div>
                <p className="text-secondary dark:text-white text-lg sm:text-xl">{toTitleCase(dict.subtitle)}</p>

                {/* Mobile: Botón de auditoría debajo de la descripción */}
                <div className="block md:hidden mt-6">
                  <Link
                    href={`/${locale}/audit`}
                    className="w-fit flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm transition-all duration-300"
                  >
                    <span className="text-base text-white font-bold">
                      {dict.mobileAuditButton || "Solicitar Auditoría Gratuita"}
                    </span>
                  </Link>
                </div>

                {/* Trust Metrics */}
                <div className="hidden md:flex flex-wrap items-center gap-6 md:gap-8 lg:gap-12 mt-8">
                  <div className="flex items-center gap-3 text-secondary dark:text-white">
                    <Users size={28} className="text-blue-400" />
                    <span className="text-lg md:text-xl font-semibold">{dict.clients}</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary dark:text-white">
                    <Star size={28} className="text-amber-400" />
                    <span className="text-lg md:text-xl font-semibold">{dict.satisfaction}</span>
                  </div>
                  <div className="hidden xl:flex items-center gap-3 text-secondary dark:text-white">
                    <Clock size={28} className="text-emerald-400" />
                    <span className="text-lg md:text-xl font-semibold">{dict.support}</span>
                  </div>
                </div>
              </div>

              {/* Desktop: Formulario completo */}
              <div className="hidden md:block relative bg-white dark:bg-dark-gray rounded-none md:rounded-md max-w-530px lg:max-w-md xl:max-w-530px w-full py-10 sm:px-10 sm:p-10 flex flex-col gap-8 sm:shadow-2xl sm:shadow-black/10 sm:border sm:border-gray-100 dark:sm:border-gray-700">
                <h4 className="font-semibold dark:text-white">{dict.formTitle}</h4>
                <FormComponent
                  formData={formData}
                  onChange={handleChange}
                  onNameChange={handleNameChange}
                  onServiceChange={handleServiceChange}
                  onSubmit={handleSubmit}
                  onPlaceSelect={handlePlaceSelect}
                  dict={dict}
                />

                {submitted && showThanks &&
                  <div className="flex gap-1.5 items-center absolute -bottom-9 left-0">
                    <p className="text-primaryText font-semibold">{dict.formThanks}</p>
                    <Image src="/images/home/banner/smile-emoji.svg" alt="image" width={20} height={20} />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
