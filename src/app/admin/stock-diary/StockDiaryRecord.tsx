import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { getYesNoColor } from "@/utils/getYesNoColor";
import { FaTrash } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import deleteById from "@/pages/api/admin/stock/diary/delete";
import findUserById from "@/pages/api/admin/user/findById";
import { useEffect, useState } from "react";
import { formatPrice } from "@/utils/formatPrice";
import { StockDiary } from "@/pages/api/admin/stock/diary/Models";
import findById from "@/pages/api/admin/stock/diary/findById";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import findByStockId from "@/pages/api/admin/stock/findById";
import findByColorId from "@/pages/api/admin/color/findById";
import findBySizeId from "@/pages/api/admin/size/findById";
import findByProductId from "@/pages/api/admin/product/findById";
import toast from "react-hot-toast";

interface StockDiaryProps {
    data: any;
    index: number;
    afterDelete: () => void;
}

const StockDiaryRecord: React.FC<StockDiaryProps> = ({ data, index, afterDelete }) => {
    const router = useRouter();
    const handleViewButtonClick = (id: string) => {
        router.push('/admin/stock-diary/' + id);
    };
    const [stock, setStock] = useState<string>('');
    const [createdBy, setCreatedBy] = useState<string>('');
    const [updatedBy, setUpdatedBy] = useState<string>('');

    useEffect(() => {
        const init = async () => {
            try {
                const stockResp = await findByStockId(data.stockId);
                const sizeResp = await findBySizeId(stockResp.sizeId);
                const colorResp = await findByColorId(stockResp.colorId);
                const productResp = await findByProductId(stockResp.productId);
                setStock(`Product: ${productResp.name} Size: ${sizeResp.name}, Color: ${colorResp.name}`)
                const createdBy = await findUserById(data.createdBy);
                setCreatedBy(createdBy.firstName + ' ' + createdBy.lastName);
                const updatedBy = await findUserById(data.updatedBy);
                setUpdatedBy(updatedBy.firstName + ' ' + updatedBy.lastName);
            } catch (error) {
                toast.error('Error...')
            }
        }
        init();
    }, [data])

    const handleDeleteButtonClick = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await deleteById(id);
                console.log("Deleted category StockDiary ID:", id);
                afterDelete();
                toast.success('Deleted...')
            } catch (error) {
                toast.error('Error...')
                console.error("Error when try to delete category StockDiary ID:", id, error);
            }
        } else {
            console.log("Cancel deleting category StockDiary ID:", id);
        }
    };
    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 hover:bg-slate-300 text-center text-sm">
            <div className="flex-1 ml-4">{index}</div>
            <div className="flex-1 ml-4 hidden">{data.id}</div>
            <div className="flex-1 ml-4">{stock ?? ''}</div>
            <div className="flex-1 ml-4">{data.quantity}</div>
            <div className="flex-1 ml-4">{data.errorQuantity}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.createdAt))}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.updatedAt))}</div>
            <div className="flex-1 ml-4">{createdBy}</div>
            <div className="flex-1 ml-4">{updatedBy}</div>
            <div className={`${getYesNoColor(data.isDeleted)} flex-1 ml-4`}>{data.isDeleted ? 'Yes' : 'No'}</div>
            <div className={`${getYesNoColor(data.isActive)} flex-1 ml-4`}>{data.isActive ? 'Yes' : 'No'}</div>
            <div className="flex-1 ml-4 cursor-pointer">
                <span className="flex items-center">
                    <IoIosInformationCircle onClick={() => handleViewButtonClick(data.id)} color="blue" className="mr-1 text-lg" />
                    <FaTrash color="red" onClick={() => handleDeleteButtonClick(data.id)} className="mr-1 text-lg" />
                </span>
            </div>
        </div>
    );
}

export default StockDiaryRecord;
