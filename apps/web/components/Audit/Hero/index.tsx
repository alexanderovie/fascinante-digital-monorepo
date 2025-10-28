"use client";

import { API_ENDPOINTS } from '@/lib/api-config';
import { mapGooglePlacesTypeToCategory } from '@/lib/business-categories';
import type { Locale } from "@/lib/i18n";
import type { PlaceDetails } from "@/types/places";
import { Clock, Search, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
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
    email: string;
    website: string;
    category?: string;
    placeId?: string;
  }>({
    name: "",
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

    // Always load website and category from Google Places if available
    // This ensures automatic population of fields
    setFormData((prevData) => ({
      ...prevData,
      name: place.name,
      // Auto-load website if available from Google Places
      website: place.website || prevData.website || '',
      placeId: place.place_id,
      // Auto-load category if detected from Google Places
      // Priority: detected category > existing category
      category: mappedCategory || prevData.category || '',
    }));

    // Store detected category for display in form
    setDetectedCategory(mappedCategory);

    // Show success message with detected info
    const detectedInfo: string[] = [];
    if (place.formatted_address) {
      detectedInfo.push(place.formatted_address);
    }
    if (place.website) {
      detectedInfo.push('Website detectado');
    }
    if (mappedCategory) {
      detectedInfo.push('Categoría detectada');
    }

    if (detectedInfo.length > 0) {
      toast.success('Negocio encontrado', {
        description: detectedInfo.join(' • '),
      });
    }
  };

  const auditStats = [
    { icon: Clock, value: "2-5 Min", label: dict.common.loading || "Análisis Rápido" },
    { icon: Search, value: "100+", label: dict.audit.sections.whatWeAudit.items.keywords || "Keywords" },
    { icon: TrendingUp, value: "95%", label: dict.audit.sections.benefits.items.actionable || "Precisión" },
    { icon: Star, value: "Free", label: dict.audit.sections.benefits.items.free || "Gratuito" },
  ];

  return (
    <section>
      <div className="relative pt-24 lg:pt-32 bg-[#F5F6F6] dark:bg-secondary">
        <div className="container">
          <div className="py-20 sm:py-28">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-16">
              <div className="flex-1 flex flex-col gap-8 max-w-2xl">
                <div className="flex flex-col gap-4">
                  <div className="badge">
                    <p className="text-current">{dict.audit.badge}</p>
                  </div>
                  <h1 className="font-semibold text-secondary dark:text-white text-4xl sm:text-5xl lg:text-6xl">
                    {dict.audit.title}
                  </h1>
                  <p className="text-dusty-gray dark:text-white/70 text-lg">
                    {dict.audit.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {auditStats.map((stat, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <stat.icon className="size-5 text-primary dark:text-blue-400" />
                        <span className="font-semibold text-secondary dark:text-white text-xl">
                          {stat.value}
                        </span>
                      </div>
                      <span className="text-sm text-dusty-gray dark:text-white/70">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <div className="relative bg-transparent md:bg-white dark:md:bg-dark-gray rounded-none md:rounded-md max-w-530px lg:max-w-md xl:max-w-530px w-full py-10 md:py-7 xl:py-11 flex flex-col gap-4 md:gap-8 md:shadow-2xl md:shadow-black/10 md:border md:border-gray-100 dark:md:border-gray-700">
                  <h4 className="font-semibold dark:text-white">{dict.audit.formTitle}</h4>
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
      </div>
    </section>
  );
}

export default AuditHero;
