"use client";

import { API_ENDPOINTS } from '@/lib/api-config';
import { mapGooglePlacesTypeToCategory } from '@/lib/business-categories';
import type { Locale } from "@/lib/i18n";
import { toTitleCase } from '@/lib/utils/text-formatting';
import type { PlaceDetails } from "@/types/places";
import { ChevronRight, Clock, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import AuditForm from "./AuditForm";

interface AuditHeroProps {
  dict: Record<string, any>;
  locale: Locale;
}

function AuditHero({ dict, locale }: AuditHeroProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const ref = useRef(null);
  const [formData, setFormData] = useState<{
    name: string;
    phone?: string;
    email: string;
    website: string;
    category?: string;
    placeId?: string;
  }>({
    name: "",
    phone: "",
    email: "",
    website: "",
    category: "",
  });
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (submitted) {
      setShowThanks(true);
      const timer = setTimeout(() => {
        setShowThanks(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const loadingToast = toast.loading(dict.audit.formProcessing || 'Processing...');

    try {
      const response = await fetch(API_ENDPOINTS.audit.generate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.name,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          website: formData.website || undefined,
          placeId: formData.placeId || undefined,
          category: formData.category || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.auditId) {
        toast.dismiss(loadingToast);
        toast.success(dict.audit.formThanks || 'Audit started successfully!');
        setSubmitted(true);

        // Redirect to results page after short delay
        setTimeout(() => {
          router.push(`/${locale}/audit/results/${data.auditId}`);
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to start audit');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error starting audit', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNameChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      name: value
    }));
  };

  const handlePlaceSelect = (place: PlaceDetails) => {
    // Map Google Places type to our category
    const mappedCategory = mapGooglePlacesTypeToCategory(place.primary_type, place.types);

    // Always load website, phone and category from Google Places if available
    // This ensures automatic population of fields
    setFormData((prevData) => ({
      ...prevData,
      name: place.name,
      // Auto-load phone if available from Google Places (prefer international format)
      phone: place.international_phone_number || place.formatted_phone_number || prevData.phone || '',
      // Auto-load website if available from Google Places
      website: place.website || prevData.website || '',
      placeId: place.place_id,
      // Auto-load category if detected from Google Places
      // Priority: detected category > existing category
      category: mappedCategory || prevData.category || '',
    }));

    // Store detected category for display in form
    setDetectedCategory(mappedCategory);

    // No mostrar toast - los datos se cargan silenciosamente en el formulario
  };

  // Desktop/Tablet: Trust metrics con mismo formato que homepage
  const desktopMetrics = [
    { icon: Clock, value: dict.audit?.metrics?.speed || "2-5 Min", label: dict.audit?.metrics?.speedLabel || "Análisis Rápido" },
    { icon: Search, value: dict.audit?.metrics?.keywords || "100+", label: dict.audit?.metrics?.keywordsLabel || "Keywords" },
    { icon: Star, value: dict.audit?.metrics?.accuracy || "95%", label: dict.audit?.metrics?.accuracyLabel || "Precisión" },
  ];

  return (
    <section>
      <div className="relative pt-24 lg:pt-40 pb-8">
        <div className="bg-white dark:bg-[#303c40] h-full flex justify-center items-center">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 2xl:gap-32 py-20 items-center justify-between">
              {/* Contenido principal - Desktop/Tablet: Formato idéntico a homepage */}
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-3">
                  {/* Badge con flecha (mismo formato que homepage) */}
                  <Link
                    href={`/${locale}/contact-us`}
                    className="badge"
                  >
                    {dict.audit.badge} →
                    <ChevronRight className="ml-1 size-4 text-current" aria-hidden="true" />
                  </Link>
                  {/* Título (mismo formato que homepage) */}
                  <h1 className="text-secondary dark:text-white font-semibold min-w-[12ch]">
                    {toTitleCase(dict.audit.title)}
                  </h1>
                </div>
                {/* Subtítulo (mismo formato que homepage) */}
                <p className="text-secondary dark:text-white text-lg sm:text-xl">{dict.audit.subtitle}</p>

                {/* Mobile: Formulario después del subtítulo */}
                <div className="block lg:hidden mt-6">
                  <div className="relative bg-transparent flex flex-col gap-4">
                    <h3 className="font-semibold dark:text-white">{toTitleCase(dict.audit.formTitle)}</h3>
                    <AuditForm
                      formData={formData}
                      onChange={handleChange}
                      onNameChange={handleNameChange}
                      onSubmit={handleSubmit}
                      onPlaceSelect={handlePlaceSelect}
                      dict={dict.audit}
                      isProcessing={isProcessing}
                      locale={locale}
                      detectedCategory={detectedCategory}
                    />

                    {submitted && showThanks && (
                      <div className="flex gap-1.5 items-center">
                        <p className="text-primaryText font-semibold">{dict.audit.formThanks}</p>
                        <Image src="/images/home/banner/smile-emoji.svg" alt="image" width={20} height={20} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust Metrics - Desktop/Tablet: Formato idéntico a homepage (horizontal flex) */}
                <div className="hidden md:flex flex-wrap items-center gap-6 md:gap-8 lg:gap-12 mt-8">
                  {desktopMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-3 text-secondary dark:text-white">
                      <metric.icon size={28} className={
                        index === 0 ? "text-blue-400" :
                          index === 1 ? "text-amber-400" :
                            "text-emerald-400"
                      } />
                      <span className="text-lg md:text-xl font-semibold">{metric.value} {metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop/Tablet: Formulario a la derecha (formato idéntico a homepage) */}
              <div className="hidden lg:block relative bg-white dark:bg-[#303c40] rounded-none md:rounded-md max-w-530px lg:max-w-md xl:max-w-530px w-full py-10 sm:px-10 sm:p-10 flex flex-col sm:shadow-2xl sm:shadow-black/10 sm:border sm:border-gray-100 dark:sm:border-gray-700">
                <h3 className="font-semibold dark:text-white mb-6">{toTitleCase(dict.audit.formTitle)}</h3>
                <AuditForm
                  formData={formData}
                  onChange={handleChange}
                  onNameChange={handleNameChange}
                  onSubmit={handleSubmit}
                  onPlaceSelect={handlePlaceSelect}
                  dict={dict.audit}
                  isProcessing={isProcessing}
                  locale={locale}
                  detectedCategory={detectedCategory}
                />

                {submitted && showThanks && (
                  <div className="flex gap-1.5 items-center absolute -bottom-9 left-0">
                    <p className="text-primaryText font-semibold">{dict.audit.formThanks}</p>
                    <Image src="/images/home/banner/smile-emoji.svg" alt="image" width={20} height={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default AuditHero;
