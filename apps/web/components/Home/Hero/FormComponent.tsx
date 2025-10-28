"use client";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useI18n } from "@/app/[locale]/i18n-context";
import type { PlaceDetails } from "@/types/places";
import { useState } from "react";
import { BusinessAutocomplete } from "./BusinessAutocomplete";

interface FormComponentProps {
  formData: {
    name: string;
    number: string;
    email: string;
    services: string[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onServiceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onNameChange?: (value: string) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
  dict?: Dictionary;
}

export default function FormComponent({
  formData,
  onChange,
  onServiceChange,
  onSubmit,
  onNameChange,
  onPlaceSelect,
  dict: propDict,
}: FormComponentProps) {
  // 🎯 ELITE: Usar contexto i18n con fallback a props (mismo patrón que DesktopHeader)
  let dict: Dictionary;
  try {
    const context = useI18n();
    dict = context.dict;
  } catch {
    // Fallback a props si no hay contexto (SSR/SSG-safe)
    dict = propDict || ({} as Dictionary);
  }

  // Valores por defecto seguros para propiedades anidadas
  const heroDict = (dict?.hero as Record<string, string>) || {};
  const [errors, setErrors] = useState<{
    name?: string;
    number?: string;
    email?: string;
    services?: string;
  }>({});

  // Hero form service options - Solo 2 opciones grandes
  const heroServiceOptions: string[] = [
    heroDict.formServices1 || 'Optimización SEO',      // Optimización SEO
    heroDict.formServices2 || 'Google y Meta Ads',      // Google y Meta Ads
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/; // basic digit-only validation

    // Validación del nombre del negocio (siempre requerido)
    // Permitir caracteres especiales comunes en nombres de negocios
    const businessNameRegex = /^[a-zA-Z0-9\s&'.,-]+$/;
    if (!formData.name.trim()) {
      newErrors.name = "Business name is required.";
    } else if (formData.name.length < 2) {
      newErrors.name = "Business name must be at least 2 characters.";
    } else if (!businessNameRegex.test(formData.name)) {
      newErrors.name = "Please enter a valid business name.";
    }

    // Validación de email (opcional, pero si se ingresa debe ser válido)
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
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
              placeholder={`${heroDict.formName || 'Nombre del negocio'} *`}
              error={errors.name}
            />
          ) : (
            <input
              type="text"
              name="name"
              placeholder={`${heroDict.formName || 'Nombre del negocio'} *`}
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
            type="email"
            name="email"
            placeholder={heroDict.formEmail || 'Correo electrónico'}
            onChange={onChange}
            value={formData.email || ''}
            className="input-field"
            autoComplete="off"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-semibold text-dusty-gray dark:text-white/90">{heroDict.formServices || 'Opciones de servicio'}</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-2.5">
          {heroServiceOptions.map((title) => (
            <div
              key={title}
              className="flex items-center"
            >
              <input
                type="checkbox"
                name={title}
                onChange={onServiceChange}
                checked={formData.services.includes(title)}
                className="w-5 h-5"
                id={title}
              />
              <label htmlFor={title} className="text-dusty-gray dark:text-white/70 ml-2 cursor-pointer">
                {title}
              </label>
            </div>
          ))}
        </div>
        {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
      </div>

      <div>
        <button type="submit" className="group w-fit flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm cursor-pointer transition-all duration-300">
          <span className="text-base text-white group-hover:text-white font-bold">{heroDict.formSubmit || 'Enviar'}</span>
        </button>
      </div>
    </form>
  );
}
