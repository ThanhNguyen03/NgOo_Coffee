"use client"
import FilterSection from "@/components/layout/FilterSection";
import ProductSection from "@/components/layout/ProductSection";
import LoadingPage from "@/components/layout/LoadingPage";
import { useSession } from "next-auth/react";

export default function MenuPage() {
    const session = useSession();
    const status = session.status;

    if (status === 'loading') {
        return <LoadingPage title={'Loading info...'}>w-40 pt-[80px] h-[70vh]</LoadingPage>
    }
    return (
        <section className={`mt-8 mx-auto pt-[80px] section-2`}>
            <div className="search-form">
                <FilterSection/>
            </div>
            <div className="min-h-[100vh] p-2">
                <ProductSection/>
            </div>
        </section>
    );
}