"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import XmarkIcon from "@/components/icons/xMark";
import RightArrow from "@/components/icons/RightArrow";
import  {useSearchParams}  from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from 'react'

export default function LoginPage() {
    const path = useSearchParams().get('login');
    const [email, setEmailLogin] = useState('');
    const [password, setPasswordLogin] = useState('');
    let login = false;
    if (path === 'true') {
        login = true;
    };

    const [emailRegister, setEmailRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);
    const [loginInProgress, setLoginInProgress] = useState(false);
    
    const [isLogin, setIsLogin] = useState(login);

    async function handleFormLogin(e) {
        e.preventDefault();
        setLoginInProgress(true);

        await signIn('credentials', {email, password, callbackUrl:'/'});

        setLoginInProgress(false);
    };

    async function handleFormRegister(e) {
        e.preventDefault();
        setCreatingUser(true);
        setError(false);
        setUserCreated(false);
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({email:emailRegister, password:passwordRegister}),
            headers: {'Content-Type': 'application/json'},
        });
        if (response.ok) {
            setUserCreated(true);
        } else {
            setError(true);
        }
        setCreatingUser(false);
    }

    function redirectRegister(e) {
        e.preventDefault();
        setIsLogin(!isLogin);
    }

    return (
        <Suspense>
            <section className="mt-8 max-w-6xl mx-auto pt-[80px] h-screen overscroll-none">
                <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center z-10">
                    <div className="bg-white rounded-3xl max-w-3xl w-full grid grid-cols-2 h-[70vh] items-center gap-4">
                        <div className={`overflow-hidden relative w-full h-full z-10 ${isLogin ? '-section-slide-right' : 'section-slide-right'}`}>
                            <div style={{ backgroundImage: `url('/NgOo (1).png')` }} className="rounded-3xl h-[70vh] bg-cover bg-center flex">
                                <div className="flex items-end mx-auto mb-10">
                                    <button onClick={(e) => redirectRegister(e)} className="z-10 rounded-full py-2 px-10 bg-secondary items-center hover:bg-third hover:text-white login-link font-semibold duration-1000 relative button-hover">
                                        {isLogin  ? 'Register' : 'Login'}
                                    </button>
                                </div>
                            </div>
                            <div className={`absolute flex z-10 right-0 top-0 ${isLogin ? 'hidden' : ''}`}>
                                <Link href={'/'} className="rounded-full p-2 ml-auto mr-2 text-white">
                                    <XmarkIcon/>
                                </Link>
                            </div>
                        </div>
                        <div className={`overflow-hidden relative w-full h-full ${isLogin ? '-section-slide-left' : 'hidden'}`}>
                            <div className="absolute flex z-10 right-0 top-0">
                                <Link href={'/'} className="rounded-full p-2 ml-auto mr-2">
                                    <XmarkIcon/>
                                </Link>
                            </div>
                            <div className="p-6 py-24">
                                <h1 className="mb-4 text-center text-third text-4xl font-semibold">
                                    Login
                                </h1>
                                <form id="login" className="mx-auto max-w-sm block" onSubmit={handleFormLogin}>
                                    <input type="email" name="email" placeholder="Email" value={email} disabled={loginInProgress}
                                        onChange={e => setEmailLogin(e.target.value)}/>
                                    <input type="password" name="password" placeholder="Password" value={password} disabled={loginInProgress}
                                        onChange={e => setPasswordLogin(e.target.value)}/>
                                    <button disabled={loginInProgress} type="submit" form="login"> 
                                        Login
                                    </button>
                                    <div className="my-4 text-center text-gray-500">
                                        Or login with provider
                                    </div>
                                    <button type="button" onClick={()=>signIn('google', {callbackUrl:'/'})} className="flex justify-center gap-4 items-center not-block">
                                        <Image src={'/google.png'} alt={''} width={24} height={24}/>
                                        Login with Google
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className={`overflow-hidden relative w-full h-full ${isLogin ? 'hidden -section-slide-left' : 'section-slide-left'}`}>
                            <div className="p-6 py-24">
                                <h1 className="mb-4 text-center text-orange-600 text-4xl font-semibold">
                                    Register
                                </h1>
                                {userCreated && (
                                    <div className="my-4 text-center">
                                        Account has created. Now you can{' '}
                                        <button onClick={e => redirectRegister(e)} className="text-blue-500 inline-flex login-link">Login{' '}<RightArrow/></button>
                                    </div>
                                )}
                                {error && (
                                    <div className="my-4 text-center">
                                        An error has occurred. Please try again later
                                    </div>
                                )}
                                <form id="register" className="mx-auto max-w-sm block" onSubmit={handleFormRegister}>
                                    <input type="email" placeholder="Email" value={emailRegister} disabled={creatingUser}
                                        onChange={e => setEmailRegister(e.target.value)}/>
                                    <input type="password" placeholder="Password" value={passwordRegister} disabled={creatingUser}
                                        onChange={e => setPasswordRegister(e.target.value)}/>
                                    <button type="submit" form="register" disabled={creatingUser}> 
                                        Register
                                    </button>
                                    <div className="my-4 text-center text-gray-500">
                                        Or login with provider
                                    </div>
                                </form>
                                <div className="mx-auto max-w-sm block">
                                    <button onClick={()=>{signIn('google',{callbackUrl:'/'})}} className="flex justify-center gap-4 items-center not-block">
                                        <Image src={'/google.png'} alt={''} width={24} height={24}/>
                                        Login with Google
                                    </button>
                                    <div className="my-4 text-center text-gray-500 border-t pt-4">
                                        Existing account?{' '}
                                        <button onClick={(e) => redirectRegister(e)} className="text-blue-500 inline-flex login-link">Login here{' '}<RightArrow/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Suspense>
    );
}