"use client"
import UserTabs from "@/components/layout/UserTabs";
import ErrorBox from "@/components/layout/ErrorBox";
import { useProfile } from "@/components/useProfile";
import InfoBox from "@/components/layout/InfoBox";
import TrashIcon from "@/components/icons/Trash";
import DeleteButton from "@/components/layout/DeleteButton";
import LoadingPage from "@/components/layout/LoadingPage";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";

export default function CategoriesPage() {
    const {loading:profileLoading, data:profileData} = useProfile();
    const [categoryName, setCategoryName] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [redirectToItems, setRedirectToItems] = useState(false);

    useEffect(() => {
        fetchCategory();
    },[]);

    async function fetchCategory() {
        await fetch('/api/categories').then(response => {
            response.json().then(categories => {
                setCategories(categories);
            });
        });
    }

    if (profileLoading) {
        return <LoadingPage title={'Loading info...'}>w-40 pt-[80px] h-[73vh]</LoadingPage>
    }

    if (!profileData.admin) {
        return <ErrorBox title={'You not an Admin'}>w-40 pt-[80px] h-[73vh]</ErrorBox>
    }

    async function handleCategorySubmit(e) {
        e.preventDefault();
        const creationPromise = new Promise(async (resolve, rejects) => {
            const data = {name:categoryName};
            if (editedCategory) {
                data._id = editedCategory._id;
            }
            const response = await fetch('/api/categories', {
                method: editedCategory ? 'PUT' : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            setCategoryName('');
            fetchCategory();
            setEditedCategory(null);
            if (response.ok) resolve();
            else rejects();
        })
        await toast.promise(creationPromise, {
            loading: <InfoBox title={editedCategory ? 'Updating Category...' : 'Creating New Category...'}/>,
            success: editedCategory ? 'Successfully Updated' : 'Successfully Created!',
            error: editedCategory ? 'Sorry! Updated Error' : 'Opps! Created error!'
        })
    }

    async function handleDeleteCategory(_id) {
        const deletePromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/categories?_id='+_id, {
                method: 'DELETE',
            });
            if (response.ok) resolve();
            else rejects();
        });
        await toast.promise(deletePromise, {
            loading: <InfoBox title={'Deleting Category...'}/>,
            success: 'Successfully Deleted',
            error: 'Oops! Something went wrong :(',
        });

        fetchCategory();
        setRedirectToItems(true);
    }

    if (redirectToItems) {
        return redirect('/categories');
    }

    return (
        <section className={`mt-8 max-w-6xl mx-auto pt-[80px] ${categories?.length <= 2 ? 'h-[55vh]' : ''}`}>
            <UserTabs isAdmin={profileData.admin}/>
            <h1 className="mb-8 text-center text-orange-600 text-4xl font-semibold">
                Categories
            </h1>
            <form className="max-w-xl items-center mx-auto flex gap-2 custom-max:px-5" onSubmit={handleCategorySubmit}>
                <div className="grow">
                    <label>
                        {editedCategory ? 'Update Category Name' : 'New Category Name'}
                        {editedCategory && (
                            <>: <b>{editedCategory.name}</b></>
                        )}
                    </label>
                    <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)}/>
                </div>
                <div className="pb-2 flex gap-2 items-end">
                    <button type="submit">
                        {editedCategory ? 'Update' : 'Create'}
                    </button>
                    {editedCategory && (
                        <button type="button" className="items-end" 
                            onClick={() => {
                                setEditedCategory(null);
                                setCategoryName('');
                            }}>
                            Cancle
                        </button>
                    )}
                </div>
            </form>
            <div className="max-w-xl mx-auto custom-max:px-5">
                <h2 className="mt-6 text-sm text-gray-500">Existing Categories:</h2>
                {categories?.length > 0 && categories.map((item, index) => (
                    <div key={index} className="py-2 px-6 flex mb-1 rounded-full bg-gray-100 items-center">
                        <div className="grow">{item.name}</div>
                        <div className="flex gap-1">
                            <button type="button" className="bg-white" 
                            onClick={() => {
                                setEditedCategory(item);
                                setCategoryName(item.name);
                            }}>
                                Edit
                            </button>
                            <DeleteButton label={(<TrashIcon>w-6 h-6 text-red-500</TrashIcon>)} onDelete={() => handleDeleteCategory(item._id)}/>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}