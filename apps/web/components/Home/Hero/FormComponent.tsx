"use client";
import { useState } from "react";

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
  dict: Record<string, string>;
}

export default function FormComponent({
  formData,
  onChange,
  onServiceChange,
  onSubmit,
  dict,
}: FormComponentProps) {
  const [errors, setErrors] = useState<{
    name?: string;
    number?: string;
    email?: string;
    services?: string;
  }>({});

  // Hero form service options (marketing services)
  // Reordenadas: las primeras 2 se muestran en todas las pantallas (xl y menores)
  // Las últimas 4 solo en pantallas grandes (2xl y mayores)
  const heroServiceOptions: string[] = [
    dict.formServices1,      // Mostrar siempre (≤1280px)
    dict.formServices2,      // Mostrar siempre (≤1280px)
    dict.formServices3,      // Solo en >1280px
    dict.formServices4,      // Solo en >1280px
    dict.formServices5,      // Solo en >1280px
    dict.formServices6,      // Solo en >1280px
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/; // basic digit-only validation

    // Validación del nombre del negocio (siempre requerido)
    if (!formData.name.trim()) {
      newErrors.name = "Business name is required.";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Business name should only contain letters.";
    }

    // Validación de campos adicionales solo si están visibles (md y mayores)
    // Usamos matchMedia para verificar el breakpoint de forma segura
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;

      if (!isMobile) {
        // Solo validar en pantallas md y mayores (donde los campos son visibles)
        if (!formData.number.trim()) {
          newErrors.number = "Phone number is required.";
        } else if (!phoneRegex.test(formData.number)) {
          newErrors.number = "Enter a valid phone number (10-15 digits).";
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = "Enter a valid email address.";
        }

        if (!formData.services.length) {
          newErrors.services = "Please select at least one service.";
        }
      }
    } else {
      // En SSR, asumimos que es móvil y solo validamos el nombre
      // La validación completa se hará en el cliente si es necesario
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
          <input
            type="text"
            name="name"
            placeholder={`${dict.formName} *`}
            onChange={onChange}
            value={formData.name}
            className="input-field"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="hidden md:block">
          <input
            type="tel"
            name="number"
            placeholder={`${dict.formPhone} *`}
            onChange={onChange}
            value={formData.number}
            className="input-field"
          />
          {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
        </div>

        <div className="hidden md:block">
          <input
            type="email"
            name="email"
            placeholder={`${dict.formEmail} *`}
            onChange={onChange}
            value={formData.email}
            className="input-field"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-4">
        <p className="font-semibold text-dusty-gray dark:text-white/90">{dict.formServices} *</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-2.5">
          {heroServiceOptions.map((title, index) => (
            <div
              key={title}
              className={`flex items-center ${index >= 2 ? 'hidden xl:flex' : ''}`}
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
          <span className="text-base text-white group-hover:text-white font-bold">{dict.formSubmit}</span>
        </button>
      </div>
    </form>
  );
}
