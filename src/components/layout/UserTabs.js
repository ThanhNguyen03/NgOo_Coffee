"use client"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function UserTabs({isAdmin}) {
    const path = usePathname();

    return (
        <>
            <div className="flex gap-4 tabs mb-8 custom-max:justify-center custom-max:flex-wrap">
                <Link className={`relative pb-1 ${path === '/profile' ? 'active' : 'hover-link'}`} href={'/profile'}>Profile</Link>
                {isAdmin && (
                    <>
                        <Link className={`relative pb-1 ${path === '/categories' ? 'active' : 'hover-link'}`} href={'/categories'}>Categories</Link>
                        <Link className={`relative pb-1 ${path.includes('/menu-items') ? 'active' : 'hover-link'}`} href={'/menu-items'}>Menu Items</Link>
                        <Link className={`relative pb-1 ${path.includes('/users') ? 'active' : 'hover-link'}`} href={'/users'}>Users</Link>
                    </>
                )}
                <Link className={`relative pb-1 ${path.includes('/orders') ? 'active' : 'hover-link'}`} href={'/orders'}>Orders</Link>
            </div>
        </>
        
    );
}