"use client"
import SectionHeaders from "./SectionHeader";
import MenuItems from "@/components/menu/MenuItems";
import { useEffect, useState } from "react";

export default function BestSellers() {
    const [bestSellers, setBestSellers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);   

    useEffect(() =>  {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems);
                const bestSellers = menuItems.slice(-6);
                setBestSellers(bestSellers);
            })
        })
    }, []);

    return (
        <>
            <div className="text-center my-8 mt-24 mx-auto">
                <SectionHeaders subHeader={'check'} mainHeader={'Best Sellers!'}/>
            </div>
            <div className="grid custom-min:grid-cols-3 sm:grid-cols-2 sm:mx-auto gap-12 custom-min:px-12">
                {bestSellers?.length > 0 && bestSellers.map((item, index) => (
                    <MenuItems key={index} {...item}/>
                ))}
            </div>
        </>
    );
}