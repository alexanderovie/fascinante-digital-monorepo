import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src={"/fascinante-digital-logo-main.png"}
        alt="Fascinante Digital"
        width={190}
        height={40}
        style={{ height: '40px', width: 'auto' }}
        quality={100}
        priority={true}
        className='dark:hidden'
      />
      <Image
        src={"/fascinante-digital-logo-light.png"}
        alt="Fascinante Digital"
        width={190}
        height={40}
        style={{ height: '40px', width: 'auto' }}
        quality={100}
        priority={true}
        className='hidden dark:block'
      />
    </Link>
  );
};

export default Logo;
