"use client"
import { useProfile } from "@/components/UseProfile";
import RightArrow from "@/components/icons/RightArrow";
import ErrorBox from "@/components/layout/ErrorBox";
import LoadingPage from "@/components/layout/LoadingPage";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {
    const {loading, data} = useProfile();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch('api/menu-items').then(response => {
            response.json().then(menuItems => {
                setMenuItems(menuItems);
            });
        });
    },[]);

    if (loading) {
        return <LoadingPage title={'Loading info...'}>w-40 pt-[80px] h-[60vh]</LoadingPage>
    }

    if (!data.admin) {
        return <ErrorBox title={'You not an Admin'}>w-40 pt-[80px] h-[60vh]</ErrorBox>
    }

    return (
        <section className={`mt-8 max-w-6xl mx-auto pt-[80px] ${menuItems?.length <= 3 ? 'h-[55vh]' : ''}`}>
            <UserTabs isAdmin={data.admin}/>
            <div className="mb-8 custom-min:flex justify-center items-center">
                <h1 className="mb-2 text-center text-orange-600 text-4xl font-semibold">
                    Menu Items
                </h1>
                <div className="mb-2 flex gap-4 custom-min:absolute custom-min:right-0 custom-min:mr-40 items-center next-button justify-center">
                    <Link href={'/menu-items/new'} className="text-xl text-primary link-hover font-semibold">
                        Creat New Item
                    </Link>
                    <RightArrow className="w-8 h-8 text-primary slide-continue"/>
                </div>
            </div>
            <div className="max-w-6xl mx-auto custom-max:mx-12">
                <h2 className="mt-6 text-sm text-gray-500">Edit Categories:</h2>
                <div className="grid xl:grid-cols-5 md:grid-cols-4 gap-8 custom-max:grid-cols-3 custom-500:grid-cols-1">
                    {menuItems?.length > 0 && menuItems.map((item,index) => (
                        <Link href={'/menu-items/edit/' + item._id} key={index} className="mb-2 bg-secondary rounded-lg shadow-custom duration-500 flex flex-col justify-between custom-max:mx-auto custom-max:px-3 w-[200px] h-[310px]">
                            <div>
                                <div className="relative max-w-[165px] my-2 mx-auto overflow-hidden rounded-lg">
                                    <div style={{ backgroundImage: `url(${item.image})` }} className="rounded-lg w-[165px] h-[165px] bg-cover bg-center mb-1 border"/>
                                </div>
                                <div className="text-center mb-2 font-semibold">
                                    {item.itemName}
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-3 text-center mb-2 px-4 ">
                                {item.description}
                            </p>
                            <div className="w-fit mx-auto pb-2">
                                <button type="button" className="bg-third">
                                    <span className="text-white text-xs">
                                        Price: {item.basePrice}.000VNĐ
                                    </span>
                                </button>
                            </div>
                        </Link>
                    ))}
                </div> 
            </div>
        </section>
    );
}