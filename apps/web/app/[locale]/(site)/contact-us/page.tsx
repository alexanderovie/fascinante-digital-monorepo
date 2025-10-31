

import ContactBanner from "@/components/Contactus/ContactBanner";
import MapSection from "@/components/Contactus/MapSection";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Contact us | Fascinante Digital",
};

export default function Page() {
    return (
        <main>
            <ContactBanner/>
            <MapSection/>
        </main>
    );
};
