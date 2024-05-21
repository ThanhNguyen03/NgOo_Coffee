"use client"
import { CartContext, cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeader";
import CartInfo from "@/components/layout/CartInfo";
import TotalCartPrice from "@/components/layout/TotalCartPrice";
import InfoBox from "@/components/layout/InfoBox";
import { useContext, useEffect, useState } from "react";
import InfoForm from "@/components/layout/InforForm";
import { useProfile } from "@/components/useProfile";
import PlusIcon from "@/components/icons/Plus";
import MinusIcon from "@/components/icons/Minus";
import ShoppingCart from "@/components/icons/ShoppingCart";
import XMarkIcon from "@/components/icons/xMark";
import Link from "next/link";
import RightArrow from "@/components/icons/RightArrow";
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import ErrorBox from "@/components/layout/ErrorBox";
const crypto = require('crypto');

export default function CartPage() {
    const session = useSession();
    const { cartProducts, removeCartProduct, clearCart, updateCartProduct } = useContext(CartContext);
    const [infoError, setInfoError] = useState('');
    const [info, setInfo] = useState({});
    const {data:profileData} = useProfile();    
    const [paidOption, setPaidOption] = useState('');
    const [notes, setNotes] = useState('');
    const [orderId, setOrderId] = useState('');
    let [quan, setQuantity] = useState(null);
    const [redirectToItems, setRedirectToItems] = useState(false);

    useEffect(() => {
        if (profileData?.phone === '') {
            setInfoError('Please update your phone number. ')
        }
        if (profileData?.streetAddress === '') {
            setInfoError('Please update your street address. ')
        }
        if (profileData?.city === '') {
            setInfoError('Please update your city. ')
        }
        const {phone, streetAddress, city, postalCode} = profileData;
        const infoFromProfile = {phone, streetAddress, city, postalCode};
        setInfo(infoFromProfile);
    },[profileData]);

    if (session.status === 'unauthenticated') {
        return <ErrorBox title={'Need Login to Buy Item'}>w-40 pt-[80px] h-[73vh]</ErrorBox>
    }

    let totalPrice = 0;
    let deliveryPrice = 0;
    for (const product of cartProducts) {
        totalPrice += cartProductPrice(product);
    };
    if (totalPrice < 80) {
        deliveryPrice = 10;
        totalPrice+=deliveryPrice;
    }

    function handleInfoChange(propName, value) {
        setInfo(prevInfo => ({...prevInfo, [propName]:value}));
    }

    async function handleCheckOut(e) {
        e.preventDefault();
        const payPromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    info,
                    cartProducts,
                    paid:{name: paidOption, status: false,},
                    price:totalPrice,
                    notes,
                })
            });
            if (response.ok) {
                resolve();
                if (paidOption === 'COD') {
                    const result = await response.json();
                    const order = result._id;
                    setOrderId(order);
                    setRedirectToItems(true);
                }
                else window.location = await response.json();
            }
            else rejects();
        })
        
        await toast.promise(payPromise, {
            loading: <InfoBox title={'Waiting for payment...'}/>,
            success: 'Redirecting to your payment!',
            error: 'Opps! error :(..!'
        });
        
    }

    function increaseQuantity(i, product) {
        setQuantity(product.quantity+=1);
        updateCartProduct(i, product);
    }

    function decreaseQuanlity(i, product) {
        if (product.quantity > 1) {
            setQuantity(product.quantity-=1);
            
            updateCartProduct(i, product);
        }
        else removeCartProduct(i)
    }
    let secret = process.env.SECRET_KEY+orderId;
    if (redirectToItems) {
        const signature = crypto.createHmac('sha256', secret)
            .update(orderId)
            .digest('hex');
        return redirect(`/checkout?payment=${paidOption}&orderId=${orderId}&secret=${signature}`);
    }

    return (
        <section className={`mt-8 max-w-6xl mx-auto pt-[80px]`}>
            <div className="text-center">
                <SectionHeaders mainHeader={'Cart'}/>
            </div>
            <div className="gap-12 mt-8 check-out-form custom-max:mx-8"> 
                <div>
                    {cartProducts?.length === 0 && (
                        <div className="text-center items-center flex flex-col justify-center mt-8">
                            <div className="text-3xl font-semibold italic">No products in your shopping cart</div>
                            <ShoppingCart className="w-32 h-32"/>
                            <span className="absolute ml-24 mb-12 bg-third text-white text-4xl p-2 rounded-full"><XMarkIcon/></span>
                        </div>
                    )}
                    {cartProducts?.length > 0 && cartProducts.map((product, index) => (
                        <>
                            <CartInfo product={product}>
                                <div onClick={() => {increaseQuantity(index, product)}}>
                                    <PlusIcon/>
                                </div>
                                {product.quantity}
                                <div onClick={() => {decreaseQuanlity(index, product)}}>
                                    <MinusIcon/>
                                </div>
                            </CartInfo>
                        </>
                    ))}
                    {cartProducts.length > 0 && (
                        <TotalCartPrice cartProducts={cartProducts}/>
                    )}
                </div>
                <div className="bg-secondary p-4 rounded-lg h-fit custom-max:mt-8 custom-max:mx-8">
                    <h2 className="text-center text-lg italic font-semibold">Checkout</h2>
                    <form onSubmit={handleCheckOut}>
                        <InfoForm infoProps={info} setInfoProps={handleInfoChange} editing={false} />
                        <label>Payment Methods</label>
                        <select value={paidOption} className="cursor-pointer" required onChange={e => setPaidOption(e.target.value)}>
                            <option></option>
                            <option value={'COD'}>Cash On Delivery (COD)</option>
                            <option>Momo</option>
                            <option>VNPay</option>
                        </select>
                        <label>Notes:</label>
                        <textarea placeholder="Less or more ice, less or more sweet,..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                        {infoError && (
                            <div className="bg-red-200 p-2 rounded-lg flex flex-col items-center mt-2 border border-red-700">
                                Invalid infomation! {infoError}
                                <div className="flex gap-2 justify-center text-blue-500 italic">
                                    <Link href={'/profile'} className="underline">Go here!</Link> <RightArrow/>
                                </div>
                            </div>
                        )}
                        {cartProducts.length > 0 && !infoError && (
                            <button type="submit">Pay {totalPrice}.000VNĐ</button>
                        )}
                        {cartProducts.length === 0 && (
                            <div className="bg-red-200 p-2 rounded-lg flex flex-col items-center mt-2 border border-red-700">
                                Nothing to pay! Go to Menu to see some tasty coffee
                                <div className="flex gap-2 justify-center text-blue-500 italic">
                                    <Link href={'/menu'} className="underline">Go here!</Link> <RightArrow/>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}