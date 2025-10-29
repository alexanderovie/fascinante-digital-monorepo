"use client";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useI18n } from '@/app/[locale]/i18n-context';
import type { Locale } from "@/lib/i18n";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FooterData } from './data';

interface NewsletterProps {
  locale?: Locale;
  dict?: Dictionary;
}

const Newsletter = ({ locale: propLocale, dict: propDict }: NewsletterProps = {}) => {
  // Try to use context, fallback to props (SSG-safe)
  let dict;
  try {
    const context = useI18n();
    dict = context.dict;
  } catch {
    dict = propDict;
  }

  if (!dict) return null;

  const footer = dict.footer as Record<string, string>;
  const [formData, setFormData] = useState({ email: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("https://formsubmit.co/ajax/niravjoshi87@gmail.com", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setFormData({ email: "" });
        setTimeout(() => {
          // noop
        }, 10000);
      })
      .catch((error: unknown) => {
        const err = error as { message?: string };
        console.log(err?.message);
      });
  };

  return (
    <div className="container">
      <div className='pb-8 md:pb-14 border-b border-white/15'>
        <div className='flex flex-col xl:flex-row gap-6 xl:gap-14 items-center'>

          <p className='w-full xl:max-w-xs text-white'>{footer.newsletterTitle}</p>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-6'>
            <div className='flex flex-col lg:flex-row gap-5 lg:gap-10'>
              <form onSubmit={handleSubmit} className='flex gap-2'>
                <input
                  required
                  className="input-field bg-white dark:bg-white/10"
                  id="email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={footer.newsletterPlaceholder}
                />
                <button type='submit' className='bg-primary hover:bg-white hover:text-primary py-3.5 px-6 rounded-md font-semibold cursor-pointer text-white transition-all duration-300'>
                  {footer.newsletterSubscribe}
                </button>
              </form>
              <p className='text-xs max-w-[217px] text-white/70'>{footer.newsletterDisclaimer}</p>
            </div>

            <div className='flex gap-9'>
              {FooterData.socialIcon.map((item, index) => {
                return (
                  <Link
                    href={item.link}
                    key={index}
                    className='opacity-70 hover:opacity-100 transition-opacity'
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel || `Síguenos en ${item.name}`}
                  >
                    <Image src={item.icon} alt={`${item.name} icon`} width={20} height={20} />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
