'use client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { Locale } from "@/lib/i18n";
import { toTitleCase } from '@/lib/utils/text-formatting';
import type { PlaceDetails } from "@/types/places";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import FormComponent from "./FormComponent";

interface HeroFormProps {
  dict: Record<string, string>;
  locale: Locale;
}

export function HeroForm({ dict, locale }: HeroFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const ref = useRef(null);
  const [formData, setFormData] = useState<{
    name: string;
    number: string;
    email: string;
    services: string[];
  }>({
    name: "",
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
      .then((res) => {
        if (res.ok) {
          toast.success('Request sent successfully!');
          setSubmitted(true);
          reset();
        } else {
          throw new Error('Failed to send request');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Failed to send request. Please try again.');
      })
      .finally(() => {
        toast.dismiss(loadingToast);
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      services: checked
        ? [...prev.services, value]
        : prev.services.filter(service => service !== value)
    }));
  };

  const onNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value
    }));
  };

  const onPlaceSelect = (place: PlaceDetails) => {
    setFormData(prev => ({
      ...prev,
      name: place.displayName?.text || place.name || ""
    }));
  };

  return (
    <div ref={ref} className="hidden md:block relative bg-white dark:bg-dark-gray rounded-none md:rounded-md max-w-530px lg:max-w-md xl:max-w-530px w-full py-10 sm:px-10 sm:p-10 flex flex-col sm:shadow-2xl sm:shadow-black/10 sm:border sm:border-gray-100 dark:sm:border-gray-700">
      {showThanks ? (
        <div className="flex flex-col gap-6 items-center justify-center py-8">
          <div className="flex flex-col gap-4 items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary dark:text-white text-center">
              ¡Gracias por tu interés!
            </h3>
            <p className="text-secondary/80 dark:text-white/80 text-center max-w-md">
              Hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto contigo pronto para discutir cómo podemos ayudarte a hacer crecer tu negocio.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/audit`} className="w-fit group flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm transition-all duration-300">
              <span className="text-base text-white group-hover:text-white font-bold">Obtener Auditoría Gratuita</span>
              <ChevronRight size={20} className="text-white ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => setShowThanks(false)}
              className="w-fit py-3 px-6 border border-secondary dark:border-white/25 text-secondary dark:text-white hover:bg-secondary hover:text-white dark:hover:bg-white/25 dark:hover:text-white rounded-sm transition-all duration-300"
            >
              Enviar Otra Solicitud
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold dark:text-white mb-6">{toTitleCase(dict.formTitle)}</h3>
          <FormComponent
            formData={formData}
            onChange={onChange}
            onServiceChange={onServiceChange}
            onSubmit={handleSubmit}
            onNameChange={onNameChange}
            onPlaceSelect={onPlaceSelect}
            dict={dict}
          />
        </>
      )}
    </div>
  );
}
