import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { getYesNoColor } from "@/utils/getYesNoColor";
import { FaTrash } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import deleteById from "@/pages/api/admin/stock/delete";
import findUserById from "@/pages/api/admin/user/findById";
import { useEffect, useState } from "react";
import findProductById from "@/pages/api/admin/product/findById";
import findSizeById from "@/pages/api/admin/size/findById";
import findColorById from "@/pages/api/admin/color/findById";
import { formatPrice } from "@/utils/formatPrice";
import { Stock } from "@/pages/api/admin/stock/Models";
import findById from "@/pages/api/admin/stock/findById";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

interface StockProps {
    data: any;
    index: number;
    afterDelete: () => void;
}

const StockRecord: React.FC<StockProps> = ({ data, index, afterDelete }) => {
    const router = useRouter();
    const handleViewButtonClick = (id: string) => {
        router.push('/admin/stock/' + id);
    };
    const [productName, setProductName] = useState<string>('');
    const [sizeName, setSizeName] = useState<string>('');
    const [color, setColor] = useState<any>();
    const [createdBy, setCreatedBy] = useState<string>('');
    const [updatedBy, setUpdatedBy] = useState<string>('');

    useEffect(() => {
        const init = async () => {
            const createdBy = await findUserById(data.createdBy);
            setCreatedBy(createdBy.firstName + ' ' + createdBy.lastName);
            const updatedBy = await findUserById(data.updatedBy);
            setUpdatedBy(updatedBy.firstName + ' ' + updatedBy.lastName);
            const productResp = await findProductById(data.productId);
            setProductName(productResp.name);
            const sizeResp = await findSizeById(data.sizeId);
            setSizeName(sizeResp.name);
            const colorResp = await findColorById(data.colorId);
            setColor(colorResp);
        }
        init();
    }, [data])

    const handleDeleteButtonClick = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await deleteById(id);
                console.log("Deleted stock ID:", id);
                afterDelete();
            } catch (error) {
                console.error("Error when deleting stock ID:", id, error);
            }
        } else {
            console.log("Cancel deleting ID:", id);
        }
    };


    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 hover:bg-slate-300 text-center text-sm">
            <div className="flex-1 ml-4">{index}</div>
            <div className="flex-1 ml-4 hidden">{data.id}</div>
            <div className="flex-1 ml-4">{productName}</div>
            <div className="flex-1 ml-4">{sizeName}</div>
            <div className="flex-1 ml-4">{color ? color.name : ''}
                <input
                    autoComplete="off"
                    placeholder=""
                    type="color"
                    className={`peer w-full outline-none bg-white font-light
                    border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed
                    `}
                    disabled
                    value={color ? color.code : ''}
                />
            </div>
            <div className="flex-1 ml-4">{data.quantity}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.createdAt))}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.updatedAt))}</div>
            <div className="flex-1 ml-4">{createdBy}</div>
            <div className="flex-1 ml-4">{updatedBy}</div>
            <div className={`${getYesNoColor(data.isDeleted)} flex-1 ml-4`}>{data.isDeleted ? 'Yes' : 'No'}</div>
            <div className={`${getYesNoColor(data.isActive)} flex-1 ml-4`}>{data.isActive ? 'Yes' : 'No'}</div>
            <div className="flex-1 ml-4 cursor-pointer">
                <span className="flex items-center">
                    <IoIosInformationCircle onClick={() => handleViewButtonClick(data.id)} color="blue" className="mr-1 text-lg" />
                    {/* <FaTrash color="red" onClick={() => handleDeleteButtonClick(data.id)} className="mr-1 text-lg" /> */}
                </span>
            </div>
        </div>
    );
}

export default StockRecord;
