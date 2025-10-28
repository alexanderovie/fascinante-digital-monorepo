
import ContactForm from './ContactForm'

const ContactBanner = () => {
  return (
    <section>
      <div className='relative pt-24 lg:pt-32 bg-[#F5F6F6]'>
        <div className="container">
          <div className='py-16 lg:py-28 flex items-center justify-center'>
            <div className='flex flex-col gap-3 items-center text-center max-w-4xl'>
                            <div className="badge">
                                <p className="text-current">Contact us</p>
                            </div>
              <h2 className='text-secondary font-semibold'>Have questions? Ready to help!</h2>
              <p className='text-secondary/80 text-lg'>We&apos;ll create high-quality linkable content and build at least 40 high-authority links to each asset, paving the way for you to grow your ranking, improve brand.</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

export default ContactBanner
