"use client"
import SectionHeaders from "@/components/layout/SectionHeader";
import UserTabs from "@/components/layout/UserTabs";
import LoadingPage from "@/components/layout/LoadingPage";
import RightArrow from "@/components/icons/RightArrow";
import { useProfile } from "@/components/useProfile";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ErrorBox from "@/components/layout/ErrorBox";

export default function OrderPage() {
    const session = useSession();
    const {status} = session;
    const {loading, data:profileData} = useProfile();
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, [])

    function fetchOrders() {
        fetch('/api/orders').then(res => {
            res.json().then(orders => {
                setOrders(orders.reverse());
                setLoadingOrders(false);
            })
        })
    }

    if (status === 'unauthenticated') {
        return <ErrorBox title={'You need to Login!'}>w-40 pt-[80px] h-[73vh]</ErrorBox>
    }

    if (loadingOrders) {
        return <LoadingPage title={'Loading...'}>w-40 pt-[80px] h-[73vh]</LoadingPage>;
    } 

    return (
        <section className={`mt-8 max-w-6xl mx-auto pt-[80px] ${orders?.length <= 2 ? 'h-[70vh]' : ''}`}>
            <UserTabs isAdmin={profileData.admin}/>
            <div className="text-center">
                <SectionHeaders mainHeader={'Orders'}/>
            </div>
            <div className="mt-8 max-w-4xl mx-auto">
                {orders?.length > 0 && orders.map((order, index) => (
                    <div key={index} className="bg-gray-100 mb-2 rounded-lg p-4 custom-min:flex custom-max:mx-8">
                        <div className="grid custom-min:grid-cols-3 items-center gap-4 grow custom-max:text-center custom-max:justify-center">
                            <div className="grow max-w-[250px]">
                                <div>
                                    {order.email}
                                </div>
                                <div className="text-gray-500">
                                    {order.cartProducts.map(product => product.itemName).join(', ')}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 text-center gap-2 items-center">
                                <div className={`font-semibold border-r-2 border-black ${order.paid.name === 'Momo' ? 'text-pink-500' : `${order.paid.name === 'VNPay' ? 'text-blue-500' : ''}`}`}>
                                    {order.paid.name} 
                                </div>
                                <span className={`p-2 rounded-xl ${order.paid.status ? 'bg-green-200 border-2 border-green-500' : 'bg-red-200 border-2 border-red-500'}`}>
                                    {order.paid.status ? 'Paid' : 'Not Paid'}
                                </span>
                            </div>
                            <div className="text-right custom-min:mr-3 custom-max:text-center">
                                {String(order.createdAt).replace('T', ' ').substring(0, 16)}
                            </div>
                        </div>
                        <Link href={'/orders/'+order._id} className="whitespace-nowrap p-2 rounded-lg border-2 border-gray-300 my-auto custom-max:flex custom-max:w-fit custom-max:mx-auto custom-max:mt-2">Show order</Link>
                    </div>
                ))}
                {orders?.length === 0 && (
                    <div className="p-4 bg-red-200 border-2 border-red-500 rounded-lg text-center italic font-semibold text-xl">
                        <div className="mx-auto w-fit mb-2">
                            <svg data-name="Layer 1"viewBox="0 0 24 24"fill="currentColor"height="1em"width="1em" className="w-24 h-24 text-red-600 loading">
                                <path d="M9 11.71l.29-.3.29.3a1 1 0 001.42 0 1 1 0 000-1.42l-.3-.29.3-.29a1 1 0 00-1.46-1.42l-.29.3-.25-.3a1 1 0 10-1.46 1.42l.3.29-.3.29a1 1 0 000 1.42 1 1 0 001.42 0zm-.6 3.62a1 1 0 00-.13 1.4 1 1 0 001.41.13 3.76 3.76 0 014.72 0 1 1 0 001.41-.13 1 1 0 00-.13-1.4 5.81 5.81 0 00-7.32 0zM12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm5-11.71a1 1 0 00-1.42 0l-.29.3-.29-.3a1 1 0 00-1.42 1.42l.3.29-.3.29a1 1 0 000 1.42 1 1 0 001.42 0l.29-.3.29.3a1 1 0 001.42 0 1 1 0 000-1.42l-.3-.29.3-.29a1 1 0 000-1.42z" />
                            </svg>
                        </div>
                        You have never ordered anything. Please place an order!
                        <div className="flex gap-2 justify-center text-blue-500 italic">
                            <Link href={'/profile'} className="underline">Go to Menu!</Link> <RightArrow/>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}