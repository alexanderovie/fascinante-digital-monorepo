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

  // Hero form service options - Solo 2 opciones grandes
  const heroServiceOptions: string[] = [
    dict.formServices1,      // Optimización SEO
    dict.formServices2,      // Google y Meta Ads
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

        <div>
          <input
            type="email"
            name="email"
            placeholder={dict.formEmail}
            onChange={onChange}
            value={formData.email}
            className="input-field"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-semibold text-dusty-gray dark:text-white/90">{dict.formServices}</p>
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
          <span className="text-base text-white group-hover:text-white font-bold">{dict.formSubmit}</span>
        </button>
      </div>
    </form>
  );
}
