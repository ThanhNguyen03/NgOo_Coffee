"use client"
import SectionHeaders from "@/components/layout/SectionHeader";
import MenuItems from "@/components/menu/MenuItems";
import LoadingPage from "@/components/layout/LoadingPage";
import { useSearchParams } from "next/navigation";
import { convertStringtoQueriesObject } from "./FilterSection";
import { useEffect, useState } from "react";



export default function ProductSection() {
    const searchParams = useSearchParams();
    const paramsObj = convertStringtoQueriesObject(searchParams);

    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/categories').then(res => {
            res.json().then(categories => setCategories(categories));
        });
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems);
                setLoading(false);
            });
        });
    }, []);

    function isAvailable(arr1, arr2) {
        if (!Array.isArray(arr1)) {
            return [];
        }
        return arr1.filter(obj => arr2?.includes(obj.name));
    }

    let filteredProducts = isAvailable(categories, paramsObj?.categories);

    if (Object.keys(paramsObj).length === 0) {
        filteredProducts = categories;
    }

    if (loading) {
        return <LoadingPage title={'Loading...'}>w-40 pt-[80px] h-[60vh]</LoadingPage>;
    } 

    if (filteredProducts.length === 0) {
        return <p className="text-center text-2xl text-slate-700">Không có kết quả tìm kiếm</p>
    }

    return (
        <>
            {filteredProducts.map((product, index) => {
                return(
                    <div key={index} id={product._id}>
                        <div className="text-center my-8">
                            <SectionHeaders mainHeader={product.name}/>
                        </div>
                        <div className="grid custom-min:grid-cols-3 sm:grid-cols-2 gap-12 custom-min:px-12">
                            {menuItems?.length > 0 && menuItems.filter((menuItem) => menuItem.category === product._id).map((menuItem, index) => (
                                <MenuItems key={index} {...menuItem} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
}