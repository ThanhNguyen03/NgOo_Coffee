"use client"
import {SessionProvider} from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
    let price = cartProduct.basePrice;
    if (cartProduct.size) {
        price += cartProduct.size.price;
    }
    if (cartProduct.extras?.length > 0) {
        for (const extra of cartProduct.extras) {
            price += extra.price;
        }
    }
    return price*cartProduct.quantity;
}

export function AppProvider({children}) {
    const [cartProducts, setCartProducts] = useState([]);
    const localStorage = typeof window !== 'undefined' ? window.localStorage : null;

    useEffect(() => {
        if (localStorage && localStorage.getItem('cart')) {
            setCartProducts(JSON.parse(localStorage.getItem('cart')));
        }
    }, [localStorage]);

    function saveCartProductsToLocalStogare(cartProducts) {
        if(localStorage) {
            localStorage.setItem('cart', JSON.stringify(cartProducts));
        }
    }

    function clearCart() {
        setCartProducts([]);
        saveCartProductsToLocalStogare([]);
    }

    function removeCartProduct(indexToRemove) {
        setCartProducts(prevCartProducts => {
            const newCartProducts = prevCartProducts.filter((item, index) => index !== indexToRemove);
            saveCartProductsToLocalStogare(newCartProducts);

            return newCartProducts;
        });
        toast.success('Product removed!')
    }

    function updateCartProduct(indexToUpdate, value) {
        setCartProducts(prevCartProducts => {
            const newCartProducts = prevCartProducts.map((item, index) => {
                if (index === indexToUpdate) {
                    item.quantity === value.quantity;
                }
                return item;
            });
            saveCartProductsToLocalStogare(newCartProducts);

            return newCartProducts;
        });
    }

    function addToCart(product, size = null, extras = [], quantity=1) {
        setCartProducts(prevProducts => {
            const cartProduct = {...product, size, extras, quantity};
            const newProducts = [...prevProducts, cartProduct];
            saveCartProductsToLocalStogare(newProducts);

            return newProducts;
        });
    };

    return (
        <SessionProvider>
            <CartContext.Provider value={{cartProducts, setCartProducts, addToCart, removeCartProduct, clearCart, updateCartProduct,}}>
                {children}
            </CartContext.Provider>
        </SessionProvider>
    );
}