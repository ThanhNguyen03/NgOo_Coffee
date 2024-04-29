"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { convertStringtoQueriesObject } from "@/components/layout/FilterSection";
import SectionHeaders from "@/components/layout/SectionHeader";
import BestSellers from "@/components/layout/BestSellers";
import CartInfo from "@/components/layout/CartInfo";
import LoadingPage from "@/components/layout/LoadingPage";
import TotalCartPrice from "@/components/layout/TotalCartPrice";
import { CartContext } from "@/components/AppContext";
import { Suspense } from 'react';

function CheckOut() {
    const searchParams = useSearchParams();

    const { clearCart } = useContext(CartContext);
    const [error, setError] = useState('');
    const [paySuccessful, setPaySuccessfull] = useState(false);
    const [payResult, setPayResult] = useState(null);
    const [loading, setLoading] = useState(true);
    
    async function updateOrder(paramObj) {
        let updateData = {};
        let fetchNeeded = false; 

        if (Object.keys(paramObj).some(key => key.includes('vnp'))) {
            if (paramObj?.vnp_ResponseCode[0] !== '00') {
                switch (paramObj?.vnp_ResponseCode[0]) {
                    case '09': 
                        setError('Customer\'s card/account has not registered for InternetBanking service at the bank.');
                        break;
                    case '10': 
                        setError('Customers verify incorrect card/account information more than 3 times.');
                        break;
                    case '11': 
                        setError('Payment deadline has expired. Please retry the transaction.');
                        break;
                    case '12': 
                        setError('Customer\'s card/account is locked.');
                        break;
                    case '13': 
                        setError('You entered the wrong transaction authentication password (OTP). Please retry the transaction.');
                        break;
                    case '24': 
                        setError('Customer cancels transaction.');
                        break;
                    case '51': 
                        setError('Your account does not have enough balance to make a transaction.');
                        break;
                    case '75': 
                        setError('The payment bank is under maintenance.');
                        break;
                    case '79': 
                        setError('Customer enters the wrong payment password more than the specified number of times. Please retry the transaction!');
                        break;
                    default:
                        setError('Please retry the transaction!');
                        break;
                }
                return;
            }
            if (paramObj?.vnp_ResponseCode[0] === '00') {
                setPaySuccessfull(true);
                clearCart();
                let orderId = paramObj?.vnp_TxnRef[0];
                let payType = paramObj?.vnp_CardType[0];
                let ATM = paramObj?.vnp_BankCode[0];
                let transactionNo = paramObj?.vnp_BankTranNo[0];
                let name = 'VNPay'
                updateData = {name, status: paySuccessful, orderId, payType, ATM, transactionNo};
                fetchNeeded = true;
            }
        }
        if (Object.values(paramObj).some(value => value.includes('MOMO'))) {
            if (paramObj?.message[0] !== 'Successful.') {
                setError(paramObj?.message[0]);
                return;
            }
            if (paramObj?.message[0] === 'Successful.') {
                setPaySuccessfull(true);
                clearCart();
                let orderId = paramObj?.orderId[0];
                let payType = paramObj?.orderType[0];
                let ATM = paramObj?.payType[0];
                let transactionNo = paramObj?.requestId[0];
                let name = 'Momo'
                updateData = {name, status: paySuccessful, orderId, payType, ATM, transactionNo};
                fetchNeeded = true;
            }

        }
        if (Object.values(paramObj).some(value => value.includes('COD'))) {
            let orderId = paramObj?.orderId[0];
            let name = 'COD'
            updateData = {name, orderId, status: false};
            setPaySuccessfull(true);
            clearCart();
            fetchNeeded = true;
        }

        if (fetchNeeded) {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            })
            if (response.ok) {
                const result = await response.json();
                setPayResult(result);
            }
        }
    }
    
    useEffect(() =>  {
        setLoading(true);
        const paramObj = convertStringtoQueriesObject(searchParams);
        if (paramObj) {
            updateOrder(paramObj);
            setLoading(false);
        }
    },[searchParams]);

    if (loading) {
        return <LoadingPage title={'Loading...'}>w-40 pt-[80px] h-[60vh]</LoadingPage>;
    } 

    return (
        <section className={`mt-8 max-w-6xl mx-auto pt-[80px]`}>
            <div className="text-center my-auto">
                {paySuccessful && (
                    <div>
                        <SectionHeaders mainHeader={`Thank you for your orders!`} subHeader={'from NgOo with love'}/>
                        <div className="overflow-hidden relative delivery">
                            <div className="flex gap-2 my-8 w-[80vw]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mt-8 text-primary ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                </svg>
                                <svg viewBox="0 0 640 512" fill="currentColor" height="1em" width="1em" className="w-24 h-24 text-primary loading">
                                    <path d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24h57.7l16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7H64c-17.7 0-32 14.3-32 32v32h96c88.4 0 160 71.6 160 160 0 11-1.1 21.7-3.2 32h70.4c-2.1-10.3-3.2-21-3.2-32 0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6l-55.1-102H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32h-20.4c-7.5 0-14.7 2.6-20.5 7.4l-47.4 39.5-14-26c-7-12.9-20.5-21-35.2-21H280zm182.7 279.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4 35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40h66.4c-11.2-59.2-63.2-104-125.7-104C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104h-66.5zm-59.3 8c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-semibold italic text-brown mb-2">NgOo is arriving<span className="abc1">.</span><span className="abc2">.</span><span className="abc3">.</span></h1>  
                        </div>
                        <div className="check-out-form gap-8 mt-10">
                            <div>
                                {payResult?.cartProducts.length > 0 && payResult?.cartProducts.map((product, index) => (
                                    <CartInfo product={product} key={index}>
                                        x {product.quantity}
                                    </CartInfo>
                                ))}
                            </div>
                            <div>
                                {payResult?.notes && (
                                    <div className="text-start mt-8">
                                        <label>Your notes:</label>
                                        <textarea value={payResult?.notes} disabled/>
                                    </div>
                                )}
                                {payResult?.cartProducts.length > 0 && payResult?.paid.name !== 'COD' && (
                                    <div className={`mt-4 p-4 bg-green-200 rounded-xl border-2 border-green-600 mx-4 ${payResult?.notes ? '' : ' mt-14'}`}>
                                        <h3>Payment with <b className="italic">{payResult?.paid.name}</b> Successful!</h3>
                                        <svg viewBox="0 0 24 24"fill="currentColor"height="1em"width="1em" className="text-green-500 w-24 h-24 mx-auto">
                                            <path d="M17.75 21.16l-2.75-3L16.16 17l1.59 1.59L21.34 15l1.16 1.41-4.75 4.75M13 18.21c-.5.49-1.22.79-2 .79-1.65 0-3-1.35-3-3v-3h6v1.69c.5-.77 1.2-1.42 2-1.88V11H6v5c0 1.64.81 3.09 2.03 4H4V4h2v2c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V4h2V2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10.54c-.91-1-1.48-2.33-1.54-3.79M10 9c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z" />
                                        </svg>
                                        <p className="italic mt-2"><b>Total price:</b> {payResult?.price}.000VNĐ</p>
                                    </div>                                
                                )}
                                {payResult?.cartProducts.length > 0 && payResult?.paid.name === 'COD' && (
                                    <TotalCartPrice cartProducts={payResult?.cartProducts} className={`flex justify-center items-center pt-4 ${payResult?.notes ? '' : ' mt-20'}`}/>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex justify-center flex-col items-center">
                        <h1 className="mb-8 italic font-bold text-4xl text-red-600">Payment Error</h1>
                        <svg viewBox="0 0 64 64"fill="currentColor"height="1em"width="1em" className="w-32 h-32 text-red-600 loading">
                            <g fill="none"stroke="currentColor"strokeMiterlimit={10}strokeWidth={2}>
                                <path d="M18 20h2M46 20h-2M32 47h31V5H1v42h17v12z" />
                            </g>
                            <path fill="none"stroke="currentColor"strokeMiterlimit={10}strokeWidth={2}d="M40 38a8 8 0 00-16 0"/>
                        </svg>
                        <div className={`mt-4 py-2 px-6 bg-red-200 rounded-xl border-2 border-red-600 mx-4 text-xl`}>
                            <h3 className="font-semibold italic mb-2">Somethings went wrong!</h3>
                            <p>{error}</p>
                        </div> 
                    </div>
                )}
            </div>
            <BestSellers/>
        </section>
    );
}

export default function CheckOutPage() {
    return (
        <Suspense>
            <CheckOut/>
        </Suspense>
    )
}