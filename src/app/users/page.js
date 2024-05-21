"use client"
import UserTabs from "@/components/layout/UserTabs";
import LoadingPage from "@/components/layout/LoadingPage";
import ErrorBox from "@/components/layout/ErrorBox";
import InfoBox from "@/components/layout/InfoBox";
import DeleteButton from "@/components/layout/DeleteButton";
import TrashIcon from "@/components/icons/Trash";
import { useEffect, useState } from "react";
import { useProfile } from "@/components/useProfile";
import Link from "next/link";
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";

export default function UsersPage() {
    const {loading, data} = useProfile();
    const [users, setUsers] = useState([]);
    const [redirectToItems, setRedirectToItems] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        await fetch('/api/users').then(response => {
            response.json().then(users => {
                setUsers(users);
            });
        });
    }

    if (loading) {
        return <LoadingPage title={'Loading info...'}>w-40 pt-[80px] h-[73vh]</LoadingPage>
    }

    if (!data.admin) {
        return <ErrorBox title={'You not an Admin'}>w-40 pt-[80px] h-[73vh]</ErrorBox>
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

        fetchUser();
        setRedirectToItems(true);
    };

    if (redirectToItems) {
        return redirect('/users');
    }

    return (
        <section className={`mt-8 max-w-6xl mx-auto pt-[80px] ${users?.length < 5 ? 'pb-[110px]' : ''}`}>
            <UserTabs isAdmin={data.admin}/>
            <h1 className="mb-8 text-center text-orange-600 text-4xl font-semibold">
                Users
            </h1>
            <div className="max-w-3xl mx-auto custom-max:px-8">
                {users?.length > 0 && users.map((user, index) => (
                    <div key={index} className="py-2 px-6 flex mb-1 rounded-full bg-gray-100 items-center custom-500:flex-col">
                        <div className="grow grid grid-cols-4 items-center custom-500:flex-col custom-500:flex">
                            <div className="text-gray-700">
                                {user.name ? (<span>{user.name}</span>) : (<span className="italic">No Name</span>)}
                            </div>
                            <span className="text-gray-400">{user.email}</span>
                        </div>
                        <div className="flex gap-1">
                            <Link href={'/users/'+user._id} className="bg-white button" >
                                Edit
                            </Link>
                            <DeleteButton label={(<TrashIcon>w-6 h-6 text-red-500</TrashIcon>)} onDelete={() => handleDeleteUser(user._id)}/>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}