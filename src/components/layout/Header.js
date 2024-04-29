"use client";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { CartContext } from "../AppContext";
import { useContext, useState } from "react";
import ShoppingCart from "@/components/icons/ShoppingCart";
import MenuIcon from "@/components/icons/MenuIcon";
import GlobalIcon from "@/components/icons/Global";

function AuthLinks({status, userName}) {
    if (status === 'authenticated') {
        return (
            <>
                <Link href={'/profile'} className="login-link whitespace-nowrap py-2 custom-max:hover:text-white">
                    Hello, <span className="font-semibold">{userName}</span>!
                </Link>
                <button onClick={()=>signOut()} className="bg-orange-600 text-white hover:bg-primary hover:text-white rounded-full px-8 py-2 login-link font-semibold except-button duration-1000 relative button-hover custom-max:w-fit custom-max:mx-auto custom-max:px-20">
                    LogOut
                </button>
            </>
        )
    }
    if(status == 'unauthenticated') { 
        return (
            <>
                <Link href={'/login?login=true'} className="login-link py-2 font-semibold custom-max:hover:text-white">Login</Link>
                <Link href={'/login?login=false'} className="bg-orange-600 text-white hover:bg-primary hover:text-white  rounded-full px-8 py-2 login-link font-semibold duration-1000 relative button-hover custom-max:w-fit custom-max:mx-auto custom-max:px-20">
                    Register
                </Link>
            </>
        )
    }
}

export default function Header() {
    const session = useSession();
    const status = session.status;
    const userDataUpdated = session.data;
    const {cartProducts} = useContext(CartContext);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    let userName = userDataUpdated?.name  || userDataUpdated?.email;
    if (userName && userName.includes(' ')) {
        userName = userName.split(' ')[0];
    }

    return (
        <header className="">
            <div className="fixed bg-secondary w-full z-10 top-0 custom-min:hidden">
                <div className="max-w-6xl mx-auto flex items-center justify-between h-max px-4">
                    <Link href={'/'} className="p-2 flex justify-center gap-1 rounded-full border border-primary hover:border-2 hover:font-semibold">
                        <span className="custom-500:hidden">Việt Nam</span>
                        <GlobalIcon/>
                    </Link>
                    <div className="flex justify-center items-center">
                        <Link className="font-semibold text-2xl text-center justify-center pt-2 login-link" href={'/'}>
                            <span className="text-orange-600 flex items-end">
                                Ng
                            <div className="login-link" href={'/'}>
                                <Image src={'/Logo.png'} alt="logo" width={50} height={50} />
                            </div>
                                o <br/> 
                            </span> 
                            <span className="text-primary">
                                Coffee
                            </span>
                        </Link>
                    </div>
                    <div className="flex gap-5 items-center">
                        <Link href={'/cart'} className="relative">
                            <ShoppingCart/>
                            {cartProducts.length > 0 && (
                                <span className="absolute -top-1 -right-2 bg-third text-white text-xs p-1 rounded-full leading-3">{cartProducts.length}</span>
                            )}
                        </Link>
                        <div onClick={() => setMobileNavOpen(!mobileNavOpen)} className="cursor-pointer">
                            <MenuIcon className={`w-6 h-6 ${mobileNavOpen ? ' rotate-90 duration-500' : ' rotate-0 duration-500'}`}/>
                        </div>
                    </div>
                </div>
            </div>
            {mobileNavOpen && (
                <div onClick={() => setMobileNavOpen(false)}
                    className={`custom-min:hidden p-4 bg-brown flex flex-col text-center gap-3 h-[90vh] overflow-hidden w-full mt-[100px] ${mobileNavOpen ? 'openNavMobile fixed inset-0 z-10 ' : '' }`}>
                    <Link className="relative pb-1 hover:font-semibold hover:text-white mt-24" href={'/#hero'}>Home</Link>
                    <Link className="relative pb-1 hover:font-semibold hover:text-white" href='/menu'>Menu</Link>
                    <Link className="relative pb-1 hover:font-semibold hover:text-white" href='/#about'>About</Link>
                    <Link className="relative pb-1 hover:font-semibold hover:text-white" href='/#contact'>Contact</Link>
                    <AuthLinks status={status} userName={userName}/>
                </div>
            )}
            <div className="fixed bg-secondary w-full z-10 top-0 custom-max:hidden">
                <div className="max-w-6xl mx-auto flex items-center justify-between h-max px-4">
                    <nav className="flex items-center gap-8 text-gray-600 font-semibold">
                        <div className="flex justify-center items-center pr-5">
                            <Link className="items-center mx-4 login-link pb-2" href={'/'}>
                                <Image src={'/Logo.png'} alt="logo" width={60} height={60} />
                            </Link>
                            <Link className="font-semibold text-2xl text-center justify-center pt-2 login-link" href={'/'}>
                                <span className="text-orange-600">
                                    NgOo <br/> 
                                </span> 
                                <span className="text-primary">
                                    Coffee
                                </span>
                            </Link>
                        </div>
                        <Link className="relative pb-1 link-hover" href={'/#hero'}>Home</Link>
                        <Link className="relative pb-1 link-hover" href='/menu'>Menu</Link>
                        <Link className="relative pb-1 link-hover" href='/#about'>About</Link>
                        <Link className="relative pb-1 link-hover" href='/#contact'>Contact</Link>
                    </nav>
                    <nav className="flex items-center gap-4 text-gray-600 font-semibold justify-center">
                        <AuthLinks status={status} userName={userName} cartProducts={cartProducts}/>
                        {status === 'authenticated' && (
                            <Link href={'/cart'} className="relative">
                                <ShoppingCart/>
                                {cartProducts.length > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-third text-white text-xs p-1 rounded-full leading-3">{cartProducts.length}</span>
                                )}
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}