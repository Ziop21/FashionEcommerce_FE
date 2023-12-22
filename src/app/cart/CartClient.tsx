'use client'

import { useCart } from "@/hooks/useCart";
import Container from "../components/Container";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../components/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "../../utils/formatPrice";
import { useRouter } from "next/navigation";

const Horizontal = () =>{
    return <hr className="w-[30%] my-2"/>
 }

const CartClient = () => {
    const router = useRouter();
    const {cartProducts, handleClearCart, cartTotalAmount} = useCart()

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-2xl">Your cart is empty</div>
                <div>
                    <Link href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                        <MdArrowBack/>
                        <span>Start Shopping</span>
                    </Link>
                </div>
            </div>
        )
    }
    return ( 
        <div>
            <Heading title="Shopping Cart" center />
            <div className="grid grid-cols-6 text-x5 gap-3 pb-2 itens-center mt-8">
                <div className="justify-self-start col-span-2">PRODUCT</div>
                <div className="justify-self-center">SIZE</div>
                <div className="justify-self-center">PRICE</div>
                <div className="justify-self-center">QUANTITY</div>
                <div className="justify-self-end">TOTAL</div>
            </div>
            <Horizontal />
            <div>
                {cartProducts && cartProducts.map((item) => {
                    return <ItemContent key={item.productId} item={item}/>;
                })}
            </div>
            <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
                <div className="w-[90px]">
                    <Button label="Clear Cart" onClick={()=>{handleClearCart()}} small outline />
                </div>

                <div className="text-sm flex flex-col gap-1 items-start">
                    <div>
                        <div className="flex justify-between text-base w-full font-semibold">
                            <span>Subtotal</span>
                            <span>{formatPrice(cartTotalAmount)}</span>
                        </div>
                        <p className="text-slate-500">Taxes and shipping calculate at checkout</p>
                        <Button label="Checkout" onClick={()=>{router.push("/checkout")}} />
                        <Link href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                        <MdArrowBack/>
                        <span>Continue Shopping</span>
                    </Link>
                    </div>
                </div>
            </div>

        </div>
     );
}
 
export default CartClient;