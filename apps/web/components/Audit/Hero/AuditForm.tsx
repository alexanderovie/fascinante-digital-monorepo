"use client";

import { BusinessAutocomplete } from "@/components/Home/Hero/BusinessAutocomplete";
import { BUSINESS_CATEGORIES, getCategoryLabel, mapGooglePlacesTypeToCategory } from "@/lib/business-categories";
import type { PlaceDetails } from "@/types/places";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface AuditFormProps {
  formData: {
    name: string;
    email: string;
    website: string;
    category?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNameChange?: (value: string) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  dict: Record<string, string>;
  isProcessing?: boolean;
  locale?: 'es' | 'en';
  detectedCategory?: string | null; // Category detected from Google Places
}

export default function AuditForm({
  formData,
  onChange,
  onNameChange,
  onPlaceSelect,
  onSubmit,
  dict,
  isProcessing = false,
  locale = 'es',
  detectedCategory = null,
}: AuditFormProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    website?: string;
    category?: string;
  }>({});

  // Auto-select category if detected from Google Places
  useEffect(() => {
    if (detectedCategory && step === 2 && !formData.category) {
      onChange({
        target: { name: 'category', value: detectedCategory }
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [detectedCategory, step]);

  const validateStep1 = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    // Business name validation (required)
    const businessNameRegex = /^[a-zA-Z0-9\s&'.,-]+$/;
    if (!formData.name.trim()) {
      newErrors.name = "Business name is required.";
    } else if (formData.name.length < 2) {
      newErrors.name = "Business name must be at least 2 characters.";
    } else if (!businessNameRegex.test(formData.name)) {
      newErrors.name = "Please enter a valid business name.";
    }

    // Email validation (optional, but must be valid if provided)
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Website validation (optional, but must be valid if provided)
    if (formData.website.trim() && !urlRegex.test(formData.website) && !formData.website.includes('.')) {
      newErrors.website = "Enter a valid website URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: typeof errors = {};
    
    // Category is REQUIRED
    if (!formData.category || !formData.category.trim()) {
      newErrors.category = dict.formCategoryRequired || "Category is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep(1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else {
      if (validateStep2()) {
        onSubmit(e);
      }
    }
  };

  // Get category label based on locale
  const getCategoryDisplayLabel = (value: string) => {
    return getCategoryLabel(value, locale);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            1
          </div>
          <span className={`text-sm ${step >= 1 ? 'font-medium text-secondary dark:text-white' : 'text-gray-400'}`}>
            {dict.formStep1 || 'Step 1 of 2'}
          </span>
        </div>
        <div className="flex-1 h-0.5 mx-3 bg-gray-200 dark:bg-gray-700">
          <div className={`h-full transition-all duration-300 ${
            step >= 2 ? 'bg-primary w-full' : 'w-0'
          }`} />
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            2
          </div>
          <span className={`text-sm ${step >= 2 ? 'font-medium text-secondary dark:text-white' : 'text-gray-400'}`}>
            {dict.formStep2 || 'Step 2 of 2'}
          </span>
        </div>
      </div>

      {/* Step 1: Business Info */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            {onNameChange ? (
              <BusinessAutocomplete
                value={formData.name === undefined || formData.name === null ? '' : String(formData.name)}
                onChange={onNameChange}
                onSelect={onPlaceSelect}
                placeholder={`${dict.formName} *`}
                error={errors.name}
              />
            ) : (
              <input
                type="text"
                name="name"
                placeholder={`${dict.formName} *`}
                onChange={onChange}
                value={formData.name || ''}
                className="input-field"
                autoComplete="off"
              />
            )}
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="url"
              name="website"
              placeholder={dict.formWebsite || "Website (opcional)"}
              onChange={onChange}
              value={formData.website || ''}
              className="input-field"
              autoComplete="off"
            />
            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder={dict.formEmail || "Correo electrónico"}
              onChange={onChange}
              value={formData.email || ''}
              className="input-field"
              autoComplete="off"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleNext}
              className="group w-fit flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm cursor-pointer transition-all duration-300"
            >
              <span className="text-base text-white group-hover:text-white font-bold">
                {dict.formNext || 'Continue'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Category */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-secondary dark:text-white mb-2">
              {dict.formCategory || "Categoría del negocio"} *
            </label>
            {detectedCategory && (
              <p className="text-xs text-primary dark:text-blue-400 mb-2 flex items-center gap-1">
                <span>✓</span>
                {dict.formCategoryAuto || "Detectada de Google Places"}
              </p>
            )}
            <select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={onChange}
              className="input-field"
            >
              <option value="">
                {dict.formCategoryPlaceholder || "Selecciona la categoría"}
              </option>
              {BUSINESS_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {getCategoryDisplayLabel(category.value)}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div className="flex flex-col gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="w-fit flex items-center gap-2 py-2 px-4 text-secondary dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors text-sm"
            >
              <ChevronLeft className="size-4" />
              <span>{dict.formBack || 'Back'}</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="group w-fit flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-base text-white group-hover:text-white font-bold">
                {isProcessing ? (dict.formProcessing || 'Processing...') : (dict.formSubmit || 'Start Audit')}
              </span>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
