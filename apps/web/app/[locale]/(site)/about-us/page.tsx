import OurCareer from "@/components/Aboutus/OurCareer";
import OurCustomers from "@/components/Aboutus/OurCustomers";
import OurImpact from "@/components/Aboutus/OurImpact";
import Quotes from "@/components/Aboutus/Quotes";
import WhoWeAre from "@/components/Aboutus/WhoWeAre";
import ServicesHero from "@/components/Services/ServicesHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us | Fascinante Digital",
};

export default function Page() {
  return (
    <main>
      <ServicesHero anchorLink="#whoweare" />
      <WhoWeAre />
      <OurCustomers />
      <OurImpact />
      <Quotes />
      <OurCareer />
    </main>
  );
};
