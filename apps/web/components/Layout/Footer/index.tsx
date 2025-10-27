import FooterCopyright from './FooterCopyright'
import FooterInfo from './FooterInfo'
import Newsletter from './Newsletter'

const Footer = () => {
  return (
    <footer>
      <div className='relative z-10 pt-14 md:pt-28 bg-secondary'>
        <Newsletter />
        <FooterInfo />
        <FooterCopyright />
      </div>
    </footer>
  )
}

export default Footer
