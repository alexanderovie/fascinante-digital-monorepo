"use client";

import { BusinessAutocomplete } from "@/components/Home/Hero/BusinessAutocomplete";
import type { PlaceDetails } from "@/types/places";
import { useState } from "react";

interface AuditFormProps {
  formData: {
    name: string;
    email: string;
    website: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange?: (value: string) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  dict: Record<string, string>;
  isProcessing?: boolean;
}

export default function AuditForm({
  formData,
  onChange,
  onNameChange,
  onPlaceSelect,
  onSubmit,
  dict,
  isProcessing = false,
}: AuditFormProps) {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    website?: string;
  }>({});

  const validateForm = () => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
      </div>

      <div className="flex flex-col gap-3">
        {/* Botón principal - igual al hero desktop */}
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
    </form>
  );
}
