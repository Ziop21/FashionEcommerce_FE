import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { getYesNoColor } from "@/utils/getYesNoColor";
import { FaTrash } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import deleteById from "@/pages/api/admin/size/delete";

interface SizeProps {
    data: any;
    index: number;
    afterDelete: () => void;
}


const SizeRecord: React.FC<SizeProps> = ({ data, index, afterDelete}) => {
    const router = useRouter();
    const handleViewButtonClick = (id: string) => {
        router.push('/admin/size/' + id);
    };

    const handleDeleteButtonClick = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await deleteById(id);
                console.log("Deleted size ID:", id);
                afterDelete();
            } catch (error) {
                console.error("Error ID:", id, error);
            }
        } else {
            console.log("Cancel deleting size ID:", id);
        }
    };
    
    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 hover:bg-slate-300 text-center text-sm">
            <div className="flex-1 ml-4">{index}</div>
            <div className="flex-1 ml-4 hidden">{data.id}</div>
            <div className="flex-1 ml-4">{data.name}</div>
            <div className="flex-1 ml-4">{data.description}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.createdAt))}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.updatedAt))}</div>  
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

export default SizeRecord;
