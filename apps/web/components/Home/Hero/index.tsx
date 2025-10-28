"use client";
import { ChevronRight, Clock, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import FormComponent from "./FormComponent";

function HeroSection() {
  const [submitted, setSubmitted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const ref = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    services: [] as string[],
  });

  useEffect(() => {
    if (submitted) {
      setShowThanks(true);
      const timer = setTimeout(() => {
        setShowThanks(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const reset = () => {
    setFormData({
      name: "",
      number: "",
      email: "",
      services: [],
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const loadingToast = toast.loading('Sending request...');

    fetch("http://localhost:32947/api/contact", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.number,
        message: `Services requested: ${formData.services.join(", ")}`,
        service: "Hero Form"
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.dismiss(loadingToast);
          toast.success('Request sent successfully!', {
            description: "We'll contact you soon."
          });
          setSubmitted(data.success);
          reset();
        } else {
          throw new Error(data.error || 'Error al enviar solicitud');
        }
      })
      .catch((error) => {
        toast.dismiss(loadingToast);
        toast.error('Error sending request', {
          description: 'Please try again.'
        });
        console.log(error.message);
      });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => {
      if (checked) {
        return { ...prevData, services: [...prevData.services, name] };
      } else {
        return { ...prevData, services: prevData.services.filter((service) => service !== name) };
      }
    });
  };

  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 1, delay: 0.8 },
  };

  function useTypingEffect(text = '', speed = 50) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
      if (!text) return;

      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
        if (index >= text.length) clearInterval(interval);
      }, speed);

      return () => clearInterval(interval);
    }, [text, speed]);

    return displayedText;
  }

  const baseHeading = "Digital Growth for Ambitious Brands";
  const changingWords = [""];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState('Services'); // Inicializa con la primera palabra
  const [isTyping, setIsTyping] = useState(false);

  const paragraphText = "We build bilingual marketing systems that make your business visible, credible, and unstoppable — everywhere your customers search.";

  // Efecto de mecanografía para la palabra cambiante
  useEffect(() => {
    const currentWord = changingWords[currentWordIndex];
    setIsTyping(true);
    setDisplayedWord('');

    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedWord(prev => prev + currentWord.charAt(index));
      index++;
      if (index >= currentWord.length) {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 100); // Velocidad de escritura: 100ms por letra

    return () => clearInterval(typingInterval);
  }, [currentWordIndex, changingWords]);

  // Cambio de palabra cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 1) % changingWords.length);
    }, 3000); // Aumenté a 3 segundos para dar tiempo a la escritura

    return () => clearInterval(interval);
  }, [changingWords.length]);


  return (
    <section>
      <div className="relative pt-24 lg:pt-32">
        <div className="bg-white h-full flex justify-center items-center">
          <div className="container">
            <div ref={ref} className="flex flex-col lg:flex-row gap-10 xl:gap-20 2xl:gap-32 py-20 items-center lg:items-center justify-between">
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-purple-700 bg-purple-50 hover:bg-purple-100 hover:border-purple-800 shadow-xs h-8 gap-1.5 px-3 rounded-full w-fit text-purple-800"
                  >
                    ✨
                    <div className="bg-purple-700/20 shrink-0 w-[1px] mx-2 h-4"></div>
                    Watch How We Build Authority →
                    <ChevronRight className="text-purple-700 ml-1 size-4" aria-hidden="true" />
                  </Link>
                  <h1 className="text-secondary dark:text-white font-semibold">
                    {baseHeading}{" "}
                    <span className="inline-block">
                      {displayedWord}
                      {isTyping && <span className="animate-pulse text-primary">|</span>}
                    </span>
                  </h1>
                </div>
                <p className="text-secondary dark:text-white text-lg sm:text-xl">{paragraphText}</p>

                {/* Trust Metrics */}
                <div className="flex flex-wrap items-center gap-6 md:gap-8 lg:gap-12 mt-8">
                  <div className="flex items-center gap-3 text-secondary dark:text-white">
                    <Users size={28} className="text-blue-400" />
                    <span className="text-lg md:text-xl font-semibold">500+ Clients</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary dark:text-white">
                    <Star size={28} className="text-amber-400" />
                    <span className="text-lg md:text-xl font-semibold">99% Satisfaction</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary dark:text-white">
                    <Clock size={28} className="text-emerald-400" />
                    <span className="text-lg md:text-xl font-semibold">24/7 Support</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-white dark:bg-dark-gray rounded-md max-w-530px lg:max-w-md xl:max-w-530px w-full p-10 flex flex-col gap-8 shadow-2xl shadow-black/10 border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold dark:text-white">Get Your Free Growth Plan</h4>
                <FormComponent
                  formData={formData}
                  submitted={submitted}
                  showThanks={showThanks}
                  onChange={handleChange}
                  onServiceChange={handleServiceChange}
                  onSubmit={handleSubmit}
                />

                {submitted && showThanks &&
                  <div className="flex gap-1.5 items-center absolute -bottom-9 left-0">
                    <p className="text-primaryText font-semibold">Thank you for reaching out!</p>
                    <Image src="/images/home/banner/smile-emoji.svg" alt="image" width={20} height={20} />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
