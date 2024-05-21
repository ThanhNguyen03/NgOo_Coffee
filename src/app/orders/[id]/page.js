"use client"
import SectionHeaders from "@/components/layout/SectionHeader";
import UserTabs from "@/components/layout/UserTabs";
import CartInfo from "@/components/layout/CartInfo";
import LoadingPage from "@/components/layout/LoadingPage";
import TotalCartPrice from "@/components/layout/TotalCartPrice";
import InfoForm from "@/components/layout/InforForm";
import LeftArrow from "@/components/icons/LeftArrow";
import Link from "next/link";
import { useProfile } from "@/components/useProfile";
import { useParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/components/AppContext";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default function OrderViewPage() {
    const { addToCart } = useContext(CartContext);
    const [order, setOrder] = useState(null);
    const {loading, data:profileData} = useProfile();
    const {id} = useParams();
    const [redirectToItems, setRedirectToItems] = useState(false);
    const [loadingOrder, setLoadingOrder] = useState(true);

    useEffect(() => {
        if (id) {
            setLoadingOrder(true);
            fetch('/api/orders?_id='+id).then(res => {
                res.json().then(order => {
                    setOrder(order);
                    setLoadingOrder(false);
                })
            });
        }
    }, [id]);
 
    function handleReOrder(e, order) {
        e.preventDefault();
        if (order?.cartProducts?.length > 0) {
            order.cartProducts.map(product => {
                addToCart(product, product.size, product.extraIngredientPrices, product.quantity);
            })
            toast.success('Re-Order Completed!');
        }
        setRedirectToItems(true);
    }

    if (loadingOrder) {
        return <LoadingPage title={'Loading...'}>w-40 pt-[80px] h-[73vh]</LoadingPage>;
    } 

    if (redirectToItems) {
        return redirect('/cart');
    }

    return (
        <section className={`mt-8 max-w-6xl mx-auto pt-[80px]`}>
            <UserTabs isAdmin={profileData.admin}/>
            <div className="mb-8 custom-min:flex justify-center items-center">
                <div className="text-center mb-4">
                    <SectionHeaders mainHeader={'Orders'}/>
                </div>
                <div className="mb-4 flex gap-4 custom-min:absolute custom-min:left-0 custom-min:ml-44 justify-center items-center back-button">
                    <LeftArrow className="w-8 h-8 text-primary slide-left"></LeftArrow>
                    <Link href={'/menu-items'} className="text-xl text-primary font-semibold link-hover">Back</Link>
                </div>
            </div>
            {order && (
                <div className="gap-12 mt-8 check-out-form custom-max:mx-5">
                    <div>
                        {order.cartProducts?.length > 0 && order.cartProducts.map((product, index) => (
                            <CartInfo product={product} key={index}>
                                <p className="whitespace-nowrap">x {product.quantity}</p>
                            </CartInfo>
                        ))}
                        {order.cartProducts?.length > 0 && (
                            <TotalCartPrice cartProducts={order.cartProducts} className="pt-8 pr-14 flex justify-end items-center"/>
                        )}
                    </div>
                    <form onSubmit={(e) =>handleReOrder(e, order)} className="bg-gray-100 p-2 rounded-md h-fit custom-max:mt-4">
                        <InfoForm infoProps={order} editing={false} />
                        <label>Payment method</label>
                        <input type="text" value={order.paid.name} disabled/>
                        {order.notes && (
                            <textarea disabled value={order.notes}/>
                        )}
                        <button type="submit">Re-order</button>
                    </form>
                </div>
            )}
        </section>
    );
}