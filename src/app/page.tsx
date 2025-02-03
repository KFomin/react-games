import Navigation from "@/app/navigation";

export default function Home() {
    const mainStyle =
        "grid grid-rows-[20px_1fr_20px] items-center sm:p-20 " +
        "justify-items-center min-h-screen p-8 pb-20 gap-16 " +
        "font-[family-name:var(--font-geist-sans)]" +
        "font-medium text-stone-300 text-lg";

    return (
        <div className={mainStyle}>
            <Navigation></Navigation>
        </div>
    );
}
