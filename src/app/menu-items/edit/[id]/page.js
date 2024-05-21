"use client"
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/useProfile";
import ErrorBox from "@/components/layout/ErrorBox";
import LoadingPage from "@/components/layout/LoadingPage";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import InfoBox from "@/components/layout/InfoBox";
import LeftArrow from "@/components/icons/LeftArrow";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";

export default function EditMenuItemPage() {
    const {id} = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const {loading, data} = useProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);

    useEffect(() => {
        fetch('/api/menu-items').then(response => {
            response.json().then(items => {
                const item = items.find(i => i._id === id);
                setMenuItem(item);
            });
        });
    });

    if (loading) {
        return <LoadingPage title={'Loading info...'}>w-40 pt-[80px] h-[73vh]</LoadingPage>
    }

    if (!data.admin) {
        return <ErrorBox title={'You not an Admin'}>w-40 pt-[80px] h-[73vh]</ErrorBox>
    }

    async function handleFormSubmit(e, data) {
        e.preventDefault();
        const savingPromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/menu-items', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...data, _id:id})
            });
            if (response.ok) resolve();
            else rejects();
        });
        
        await toast.promise(savingPromise, {
            loading: <InfoBox title={'Saving this tasty item...'}/>,
            success: 'Successfully Saved!',
            error: 'Opps! error :(..!'
        });
        
        setRedirectToItems(true);
    }

    if (redirectToItems) {
        return redirect('/menu-items');
    }
    
    return (
        <section className="mt-8 max-w-6xl mx-auto pt-[80px]">
            <UserTabs isAdmin={data.admin}/>
            <div className="mb-8 custom-min:flex justify-center items-center">
                <h1 className="mb-4 text-center text-orange-600 text-4xl font-semibold">
                    Edit Menu Items
                </h1>
                <div className="mb-4 flex gap-4 custom-min:absolute custom-min:left-0 custom-min:ml-44 justify-center items-center back-button">
                    <LeftArrow className="w-8 h-8 text-primary slide-left"></LeftArrow>
                    <Link href={'/menu-items'} className="text-xl text-primary font-semibold link-hover">Back</Link>
                </div>
            </div>
            <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} isCreate={false}/>
        </section>
    );
}