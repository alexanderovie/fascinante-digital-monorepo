import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      width={140}
      height={34}
      className="transition-all group-data-[collapsible=icon]:w-10"
      alt="Fascinante Digital logo"
      unoptimized
    />
  );
}
