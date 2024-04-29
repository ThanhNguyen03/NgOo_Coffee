"use client"
import UserTabs from "@/components/layout/UserTabs";
import UserForm from "@/components/layout/UserForm";
import LoadingPage from "@/components/layout/LoadingPage";
import ErrorBox from "@/components/layout/ErrorBox";
import InfoBox from "@/components/layout/InfoBox";
import LeftArrow from "@/components/icons/LeftArrow";
import DeleteButton from "@/components/layout/DeleteButton";
import { useEffect, useState } from "react";
import { useProfile } from "@/components/useProfile";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";

export default function UserPage() {
    const {loading, data} = useProfile();
    const [user, setUser] = useState(null);
    const {id} = useParams();
    const [redirectToItems, setRedirectToItems] = useState(false);

    useEffect(() => {
        fetch('/api/profile?_id='+id).then(response => {
            response.json().then(user => {
                setUser(user);
            });
        });
    });

    if (loading) {
        return <LoadingPage title={'Loading info...'}>w-40 pt-[80px] h-[60vh]</LoadingPage>
    }

    if (!data.admin) {
        return <ErrorBox title={'You not an Admin'}>w-40 pt-[80px] h-[60vh]</ErrorBox>
    }

    async function handleUpdateUser(e, data) {
        e.preventDefault();
        const savingPromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...data, _id:id}),
            });
            if (response.ok) {
                resolve();
            } else rejects();
        })
        await toast.promise(savingPromise, {
            loading: <InfoBox title={'Saving...'}/>,
            success: 'Successfully Saved!',
            error: 'Saved error!'
        });
    }

    async function handleDeleteUser(_id) {
        const deletePromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/profile?_id='+_id, {
                method: 'DELETE',
            });
            if (response.ok) resolve();
            else rejects();
        });
        await toast.promise(deletePromise, {
            loading: <InfoBox title={'Deleting User...'}/>,
            success: 'Successfully Deleted',
            error: 'Oops! Something went wrong :(',
        });
        setRedirectToItems(true);
    };

    if (redirectToItems) {
        return redirect('/users');
    };

    return (
        <section className="mt-8 max-w-6xl mx-auto pt-[80px]">
            <UserTabs isAdmin={data.admin}/>
            <div className="mb-8 custom-min:flex justify-center items-center">
                <h1 className="mb-2 text-center text-orange-600 text-4xl font-semibold">
                    Edit Users
                </h1>
                <div className="mb-2 max-w-2xl flex gap-4 custom-min:absolute custom-min:ml-44 mt-2 items-center back-button justify-center">
                    <LeftArrow className="w-8 h-8 text-primary slide-left"></LeftArrow>
                    <Link href={'/users'} className="text-xl text-primary font-semibold link-hover">Back</Link>
                </div>
            </div>
            <div className="max-w-2xl mx-auto ml-auto custom-max:px-8">
                <UserForm user={user} onSave={handleUpdateUser} onDelete={() => handleDeleteUser(id)}/>
            </div>
        </section>
    );
}