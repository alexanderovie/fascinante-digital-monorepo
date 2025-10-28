"use client";
import { useState } from "react";

interface FormComponentProps {
  formData: {
    name: string;
    number: string;
    email: string;
    services: string[];
  };
  submitted: boolean;
  showThanks?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onServiceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormComponent({
  formData,
  submitted,
  showThanks,
  onChange,
  onServiceChange,
  onSubmit,
}: FormComponentProps) {
  const [errors, setErrors] = useState<{
    name?: string;
    number?: string;
    email?: string;
    services?: string;
  }>({});

  // Hero form service options (marketing services)
  const heroServiceOptions: string[] = [
    "Digital Branding",
    "SEO Optimization",
    "Google & Meta Ads",
    "Web Design",
    "Brand Identity",
    "Email Automation",
    "Content Strategy",
    "Analytics & Reporting",
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/; // basic digit-only validation

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name should only contain letters.";
    }

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
            placeholder="Full name *"
            onChange={onChange}
            value={formData.name}
            className="input-field"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="number"
            placeholder="Phone number *"
            onChange={onChange}
            value={formData.number}
            className="input-field"
          />
          {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address *"
            onChange={onChange}
            value={formData.email}
            className="input-field"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-semibold text-dusty-gray dark:text-white/90">Service options *</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-2.5">
          {heroServiceOptions.map((title) => (
            <div key={title} className="flex items-center">
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
          <span className="text-base text-white group-hover:text-white font-bold">Get started today</span>
        </button>
      </div>
    </form>
  );
}
