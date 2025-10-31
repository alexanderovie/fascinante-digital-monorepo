import TermsAndConditions from "@/components/TermsAndConditions";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Terms & Condition | Fascinante Digital",
};

export default function Page() {
    return (
        <main>
            <TermsAndConditions/>
        </main>
    );
};
