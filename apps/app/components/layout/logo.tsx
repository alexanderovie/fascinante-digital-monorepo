import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      width={140}
      height={34}
      className="transition-all h-[30px] sm:h-8 md:h-[34px] lg:h-9 xl:h-[38px] 2xl:h-10 w-auto group-data-[collapsible=icon]:w-10"
      alt="Fascinante Digital logo"
      unoptimized
    />
  );
}
