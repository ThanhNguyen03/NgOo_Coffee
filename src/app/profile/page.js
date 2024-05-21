"use client"
import { signOut, useSession } from "next-auth/react";
import UserTabs from "@/components/layout/UserTabs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import InfoBox from "@/components/layout/InfoBox";
import LoadingPage from "@/components/layout/LoadingPage";
import UserForm from "@/components/layout/UserForm";
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const session = useSession();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProfileFetch, setIsProfileFetch] = useState(false);
    const [user, setUser] = useState(null);
    const {status} = session;

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setUser(data);
                    setIsAdmin(data.admin);
                    setIsProfileFetch(true);
                });
            });
        }
    },[session, status]);

    if (status === 'loading') {
        return <LoadingPage title={'Loading...'}>w-40 pt-[80px] h-[73vh]</LoadingPage>;
    } 

    if (status === 'unauthenticated') {
        setIsProfileFetch(true);
        return redirect('/login?login=true');
    }

    if (!isProfileFetch) {
        return <LoadingPage title={'Loading...'}>w-40 pt-[80px] h-[73vh]</LoadingPage>;
    }

    async function handleInfoProfileUpdate(e, data) {
        e.preventDefault();
        const savingPromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            })
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

    return (
        <section className="mt-8 max-w-6xl mx-auto pt-[80px]">
            <UserTabs isAdmin={isAdmin}/>
            <h1 className="mb-8 text-center text-orange-600 text-4xl font-semibold">
                Profile
            </h1>
            <div className="max-w-2xl mx-auto custom-max:px-8">
                <UserForm user={user} onSave={handleInfoProfileUpdate}/>
            </div>
        </section>
    );
}