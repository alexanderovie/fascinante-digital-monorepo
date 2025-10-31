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
        quality={100}
        priority={true}
        className='h-[30px] sm:h-8 md:h-[34px] lg:h-9 xl:h-[38px] 2xl:h-10 w-auto dark:invert'
      />
    </Link>
  );
};

export default Logo;
