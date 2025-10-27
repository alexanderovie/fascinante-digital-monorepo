export const ColorConfiguration = () => {
    return (
        <>
            <h3 className=" text-black text-xl font-semibold mt-8 dark:text-white" >Colors</h3>
            <div className="p-6 rounded-md border mt-4 border-secondary/20 dark:border-white/20">
                <p className="text-base font-medium text-secondary dark:text-white" ><span className="font-semibold text-lg"><span className="text-black dark:text-white" >1. Override Colors</span></span> <br />
                    For any change in colors : src/app/globals.css</p>
                <div className="py-4 px-5 rounded-md bg-black mt-8">
                    <p className="text-sm text-white/70 flex flex-col gap-2">
                        <span>--color-primary: #C1FF72;</span>
                        <span>--color-secondary: #1F2A2E;</span>
                        <span>--color-darkPrimary: #a8ff39;</span>
                        <span>--color-sand-light: #D6D1C2;</span>
                        <span>--color-dusty-gray: #4D6974;</span>
                        <span> --color-light-olive: #9ACC5B;</span>
                        <span>--color-gray: #3E545D;</span>
                        <span>--color-gray-steel: #82969E;</span>
                        <span>--color-natural-gray: #E9E6DD;</span>
                        <span>--color-offwhite-warm: #F8F8F5;</span>
                        <span>--color-foggy-clay: #F4F3EE;</span>
                        <span>--color-dark-gray :#303c40;</span>
                    </p>
                </div>
            </div>
            <div className="p-6 rounded-md border mt-4 border-secondary/20 dark:border-white/20">
                <p className="text-base font-medium text-secondary dark:text-white" ><span className="font-semibold text-lg text-black dark:text-white">2. Override Theme Colors</span> <br />
                    For change , go to : src/app/globals.css</p>
                <div className="py-4 px-5 rounded-md bg-black mt-8">
                    <p className="text-sm text-white/70 flex flex-col gap-2">
                        <span>--color-primary: #C1FF72;</span>
                        <span>--color-secondary: #1F2A2E;</span>
                    </p>
                </div>
            </div>
        </>
    )
}