
import { Documentation } from "@/components/Documentation/Documentation";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Documentation | Fascinante Digital",
};

export default function Page() {
    return (
        <>
            <Documentation />
        </>
    );
};
