export const TypographyConfiguration = () => {
    return (
        <>
            <h3 className=" text-black text-xl font-semibold mt-8 dark:text-white" >Typography</h3>
            <div className="p-6 rounded-md border mt-4 border-secondary/20 dark:border-white/20">
                <p className="text-base font-medium text-secondary dark:text-white" >1. Change Font family over here : <span className="font-semibold text-base">src/app/layout.tsx</span></p>
                <div className="py-4 px-3 rounded-md bg-black mt-8">
                    <p className="text-sm text-white/70 flex flex-col gap-2 mb-3">
                        {`import { Inter } from "next/font/google";`}
                    </p>
                    <p className="text-sm text-white/70 flex flex-col gap-2">
                        {`const inter = Inter({ subsets: ["latin"],});`}
                    </p>
                </div>
            </div>
        </>
    )
}