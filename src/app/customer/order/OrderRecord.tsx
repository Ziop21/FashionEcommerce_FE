import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { getYesNoColor } from "@/utils/getYesNoColor";
import { IoIosInformationCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { OrderItem } from "@/pages/api/customer/order/Models";

interface OrderProps {
    data: any;
    index: number;
    afterDelete: () => void;
}


const OrderRecord: React.FC<OrderProps> = ({ data, index, afterDelete }) => {
    const router = useRouter();

    const [total, setTotal] = useState<number>();

    useEffect(() => {
        let tempTotal = 0;
        data.orderItems.map((item: OrderItem) => {
            tempTotal = tempTotal + item.price * item.quantity;
        });
        setTotal(tempTotal);
    }, [])

    const [viewDetail, setViewDetail] = useState<boolean>(false)
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
                    <div>
                        {
                            data.orderItems.map((item: any, index: number) => (
                                <div key={index} className="flex flex-row border-[1.2px] border-slate-200 rounded-1xl bg-slate-300">
                                    <div className="flex flex-col w-1/3 p-4">
                                        <span className="cursor-pointer text-blue-500" onClick={() => router.push(`/product/${item.productId}`)}>{`Product name: ${item.productName}`}</span>
                                        <span>{`Size: ${item.sizeName}`}</span>
                                        <span>{`Color: ${item.colorName}`}</span>
                                    </div>
                                    <span className="w-1/6 p-4">{`Quantity: ${item.quantity}`}</span>
                                    <span className="w-1/6 p-4">{`Price: ${formatPrice(item.price)}`}</span>
                                    <span className="w-1/3 p-4">{`Subtotal: ${formatPrice(item.price * item.quantity)}`}</span>
                                </div>
                            ))
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

                }
            </div>
        </div>
    );
}

export default OrderRecord;
