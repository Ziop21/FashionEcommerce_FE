'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

const Rating = () => {
    // const router = useRouter();
    const searchParams = useSearchParams();
    let [orderId, setOrderId] = useState<string>('');
    let [stocKId, setStocKId] = useState<string>('');

    useEffect(() => {
        if (searchParams) {
            setOrderId(searchParams.get('orderId') ?? '')
            setStocKId(searchParams.get('stockId') ?? '')
        }
    }, [])

    return (
        searchParams ? (
        <div>
            <span>{'orderId:' + orderId}</span>
            <span>{'stockId:' + stocKId}</span>
        </div>
        ) : (<div>nothing</div>)
    );
}
export default Rating;