import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Button as UIButton, Link } from "@nextui-org/react";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { getYesNoColor } from "@/utils/getYesNoColor";
import { IoIosInformationCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { OrderItem } from "@/pages/api/customer/order/Models";
import Button from "@/app/components/Button";
import { Review, Stock } from "@/pages/api/guest/stock/Models";
import findById from "@/pages/api/guest/stock/findById";
import toast from "react-hot-toast";
import RatingForm from "./RatingForm";
import { EOrderStatus } from "@/pages/api/admin/order/Models";

interface OrderProps {
    data: any;
    index: number;
    afterDelete: () => void;
}

const OrderRecord: React.FC<OrderProps> = ({ data, index, afterDelete }) => {
    const router = useRouter();

    const [total, setTotal] = useState<number>();
    const [ratedStocks, setRatedStocks] = useState<string[]>([]);

    useEffect(() => {
        let tempTotal = 0;
        data.orderItems.map((item: OrderItem) => {
            tempTotal = tempTotal + item.price * item.quantity;
        });
        setTotal(tempTotal);

        const fetchRatedStocks = () => {
            let ratedStocks: string[] = [];
            data.orderItems.map(async (item: any) => {
                console.log('item', item)
                const foundStock: Stock = await findById(item.stockId);
                console.log("foundStock:", foundStock);
                const reviews: Review[] = foundStock.reviews ?? [];
                console.log("reviews: ", reviews);
                const isRated: boolean = reviews ? reviews.some(review => review.orderId === data.id) : false;
                console.log("rated: ", isRated);
                if (isRated)
                    ratedStocks.push(item.stockId)


                console.log("ratedStocks: ", ratedStocks)
            })
            setRatedStocks(ratedStocks);
        }
        fetchRatedStocks();

    }, [])

    console.log("ratedStocks: ", ratedStocks)

    const [viewDetail, setViewDetail] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div>
            <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 hover:bg-slate-300 text-center text-sm">
                <div className="flex-1 ml-4">{index}</div>
                <div className="flex-1 ml-4 hidden">{data.id}</div>
                <div className="flex-1 ml-4">{data.username}</div>
                <div className="flex-1 ml-4">{data.address}</div>
                <div className="flex-1 ml-4">{data.phone}</div>
                <div className="flex-1 ml-4 hidden">{data.deliveryId}</div>
                <div className="flex-1 ml-4">{data.status}</div>
                <div className={`${getYesNoColor(data.isPaidBefore)} flex-1 ml-4`}>{data.isPaidBefore ? 'Yes' : 'No'}</div>
                <div className="flex-1 ml-4 cursor-pointer">
                    <span className="flex items-center">
                        <IoIosInformationCircle onClick={() => setViewDetail(!viewDetail)} color="blue" className="mr-1 text-lg" />
                        {/* <FaTrash color="red" onClick={() => handleDeleteButtonClick(data.id)} className="mr-1 text-lg" /> */}
                    </span>
                </div>
            </div>
            <div className="w-full">
                {viewDetail &&
                    (<div>
                        {
                            data.orderItems.map((item: any, index: number) => {
                                return (
                                    <div key={index} className="flex flex-row border-[1.2px] border-slate-200 rounded-1xl bg-slate-300">
                                        <div className="flex flex-col w-1/3 p-4">
                                            <Link href={`/product/${item.productId}`} rel="noopener noreferrer" target="_blank">
                                                <span className="cursor-pointer text-blue-500">{`Product name: ${item.productName}`}</span>
                                            </Link>
                                            <span>{`Size: ${item.sizeName}`}</span>
                                            <span>{`Color: ${item.colorName}`}</span>
                                        </div>
                                        <span className="w-1/6 p-4">{`Quantity: ${item.quantity}`}</span>
                                        <span className="w-1/6 p-4">{`Price: ${formatPrice(item.price)}`}</span>
                                        <div className="flex flex-col w-1/3">
                                            <span className="w-1/3">{`Subtotal: ${formatPrice(item.price * item.quantity)}`}</span>
                                            {data.status === EOrderStatus.COMPLETED && <div className="w-1/2">
                                                {
                                                    (ratedStocks.indexOf(item.stockId) !== -1)
                                                        ? (
                                                            <div className="flex flex-wrap md:inline-grid md:grid-cols-3 gap-4">
                                                                <Popover placement="left" backdrop="opaque" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                                                                    <PopoverTrigger>
                                                                        <UIButton color="primary" >
                                                                            view rating
                                                                        </UIButton>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent>
                                                                        <div className="px-1 py-2">
                                                                            <div className="text-small font-bold">View Rating Content</div>
                                                                            <div className="text-tiny">This is the popover content</div>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        )
                                                        :
                                                        (
                                                            <div className="flex flex-wrap md:inline-grid md:grid-cols-3 gap-4">
                                                                <Popover placement="left" backdrop="opaque" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                                                                    <PopoverTrigger>
                                                                        <UIButton color="primary">
                                                                            rating
                                                                        </UIButton>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent>
                                                                        <RatingForm
                                                                            orderId={data.id}
                                                                            stockId={item.stockId}
                                                                            afterSubmit={(isOpen) => setIsOpen(isOpen)}
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        )
                                                }

                                            </div>
                                            }
                                        </div>

                                    </div>
                                )
                            }
                            )
                        }
                        <div className="flex flex-row border-[1.2px] border-slate-200 rounded-1xl bg-slate-300 ">
                            <div className="flex flex-col w-1/3 p-4">
                            </div>
                            <span className="w-1/6 p-4"></span>
                            <span className="w-1/6 p-4"></span>
                            <span className="ml-2/3 w-1/3 p-4">{`Shipping fee: ${formatPrice(data.shippingFee)}`}</span>
                        </div>
                        <div className="flex flex-row bg-slate-200 rounded-2xl ">
                            <div className="flex flex-col w-1/3 p-4">
                            </div>
                            <span className="w-1/6 p-4"></span>
                            <span className="w-1/6 p-4"></span>
                            <span className="w-1/3 p-2">{`Total: ${formatPrice(total + data.shippingFee)}`}</span>
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
    );
}

export default OrderRecord;
