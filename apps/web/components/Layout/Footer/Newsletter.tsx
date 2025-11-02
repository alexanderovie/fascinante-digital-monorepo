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

const Newsletter = ({ dict: propDict }: NewsletterProps = {}) => {
  // ✅ ALL HOOKS FIRST - per React Rules of Hooks
  // Call all hooks at the top level, before any conditional logic
  const [formData, setFormData] = useState({ email: "" });

  // Try to get context, but call hooks unconditionally
  let contextDict;
  try {
    const context = useI18n();
    contextDict = context.dict;
  } catch {
    contextDict = undefined;
  }

  // Now derive final values from hooks (pure logic, not hook calls)
  const dict = contextDict ?? propDict;

  // ✅ CONDITIONAL RETURN AFTER ALL HOOKS
  if (!dict) return null;

  const footer = dict.footer as Record<string, string>;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use local API route with bot protection instead of external service
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Newsletter Subscriber',
        email: formData.email,
        message: 'Newsletter subscription request',
        service: 'Newsletter',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFormData({ email: '' });
        }
      })
      .catch(() => {
        // Error handling - logging removed for production (following Context7 best practices)
      });
  };

  return (
    <div className="container">
      <div className='pb-8 md:pb-14 border-b border-white/15'>
        <div className='flex flex-col xl:flex-row gap-6 xl:gap-14 items-center'>

          <p className='w-full xl:max-w-xs text-white'>{footer.newsletterTitle}</p>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-6'>
            <div className='flex flex-col lg:flex-row gap-5 lg:gap-10'>
              <form onSubmit={handleSubmit} className='flex gap-2 items-center'>
                {/* Honeypot field - hidden from users, bots will fill it */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px' }}
                  aria-hidden="true"
                />
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
                <button
                  type='submit'
                  className='group w-fit flex items-center py-3 px-6 bg-primary hover:bg-white hover:text-primary rounded-sm cursor-pointer transition-all duration-300'
                >
                  <span className='text-base text-white group-hover:text-primary font-bold'>{footer.newsletterSubscribe}</span>
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
