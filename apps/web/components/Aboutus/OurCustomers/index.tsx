import React from 'react'
import Marquee from 'react-fast-marquee'
import { ourCustomer } from './data'
import Image from 'next/image'

const OurCustomers = () => {
  return (
    <section>
      <div className='dark:bg-dark-gray'>
        <div className="container">
          <div className='flex flex-col gap-6 text-center pb-20 md:pb-28'>
            <p className='text-gray-steel'>More than 400 businesses in Florida trust <span className='font-semibold'>Fascinante Digital</span> to grow their online presence</p>
            <Marquee autoFill={true}>
              {ourCustomer.map((item, index) => {
                return (
                  <div key={index} className='py-2 lg:py-4 px-5 md:px-10'>
                    <Image src={item} alt="image" width={156} height={60} />
                  </div>
                )
              })}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurCustomers