"use client"
import Image from "next/image";
import SaleMenuItems from "@/components/layout/SaleMenuItems";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/layout/LoadingPage";
import { useSession } from "next-auth/react";
import BestSellers from "./BestSellers";

export default function HomeMenu() {
    const [menuItems, setMenuItems] = useState([]);    
    const session = useSession();
    const status = session.status;

    useEffect(() =>  {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems);
            })
        })
    }, []);

    if (status === 'loading') {
        return <LoadingPage title={'Loading info...'}>w-40 pt-[80px] h-[60vh]</LoadingPage>
    }

    return (
        <section className="py-8 max-w-6xl mx-auto mt-12">
            <div className=" absolute left-0 right-0 w-full">
                <div className="absolute left-0 -top-[-100vh] text-left -z-10">
                    <Image src={'/Ice.jpg'} alt={'ice'} width={240} height={189}/>
                </div>
                <div className="absolute -top-[80px] right-0 -z-10">
                    <Image src={'/cf_seed.jpg'} alt={'coffee seed'} width={400} height={189}/>
                </div>
                <div className="absolute right-0 -top-[-1240px] text-left -z-10">
                    <Image src={'/Ice.jpg'} alt={'ice'} width={240} height={189}/>
                </div>
            </div>
            <SaleMenuItems menuItems={menuItems}/>
            <BestSellers/>
        </section>
    );
}