"use client";
import Image from 'next/image';
import { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        email: "",
        message: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        number: "",
        email: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const reset = () => {
        setFormData({
            name: "",
            number: "",
            email: "",
            message: ""
        });
        setErrors({
            name: "",
            number: "",
            email: "",
            message: ""
        });
    };

    const validate = () => {
        const newErrors: any = {};
        const phoneRegex = /^[0-9]{10,15}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.number.trim()) newErrors.number = "Phone number is required.";
        else if (!phoneRegex.test(formData.number.trim())) newErrors.number = "Enter a valid phone number.";

        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!emailRegex.test(formData.email.trim())) newErrors.email = "Enter a valid email.";

        if (!formData.message.trim()) newErrors.message = "Message is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await fetch("https://formsubmit.co/ajax/niravjoshi87@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            setSubmitted(data.success);
            reset();
        } catch (error: any) {
            console.error("Submission error:", error.message);
        }
    };

    return (
        <div>
            <div className='p-1 sm:p-4 pb-28 flex flex-col md:flex-row bg-white dark:bg-dark-gray shadow-2xl rounded-md'>
                {/* Contact Info */}
                <div className='relative z-10 py-9 px-8 xl:py-16 xl:px-14 flex flex-col gap-6 md:gap-16 bg-primary md:max-w-lg rounded-md'>
                    <div className='flex flex-col gap-3.5'>
                        <h4 className='font-semibold dark:text-secondary'>Contact Information</h4>
                        <p>We'll create high-quality linkable content and build at least 40 high-authority.</p>
                    </div>
                    <div className='relative z-10 flex flex-col md:pb-10 gap-3 sm:gap-5 md:gap-8 xl:gap-10'>
                        <div className='flex items-center gap-3 sm:gap-6'>
                            <Image src={"/images/contactus/contact-call-icon.svg"} alt='contact-icon' width={40} height={40} />
                            <div>
                                <p>(800) 886-4981</p>
                                <p>(800) 886-4981</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 sm:gap-6'>
                            <Image src={"/images/contactus/contact-email-icon.svg"} alt='email-icon' width={40} height={40} />
                            <div>
                                <p>support@gleamer.com</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 sm:gap-6'>
                            <Image src={"/images/contactus/contact-map-icon.svg"} alt='map-icon' width={40} height={40} />
                            <div>
                                <p>Blane Street, Manchester</p>
                            </div>
                        </div>
                    </div>
                    <Image src={"/images/contactus/contact-ellipse.png"} alt='ellipse-img' width={216} height={216} className='absolute right-0 bottom-0' />
                </div>

                {/* Contact Form */}
                <div className='w-full p-7 px-3 md:py-7 xl:py-11 md:px-8 xl:px-14'>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-8">
                        <div>
                            <input type="text" name="name" placeholder="Full name *" value={formData.name} onChange={handleChange} className="input-field" />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <input type="tel" name="number" placeholder="Phone number *" value={formData.number} onChange={handleChange} className="input-field" />
                            {errors.number && <p className="text-red-600 text-sm mt-1">{errors.number}</p>}
                        </div>
                        <div>
                            <input type="email" name="email" placeholder="Email address *" value={formData.email} onChange={handleChange} className="input-field" />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <textarea name="message" placeholder='Write here your message' value={formData.message} onChange={handleChange} className="input-field" rows={6} cols={50} />
                            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                        </div>
                        <button type="submit" className="group w-fit flex items-center py-3 px-6 bg-secondary dark:bg-white/25 rounded-sm cursor-pointer">
                            <span className="text-base text-white group-hover:text-primary font-bold">Send Message</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
