import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { getYesNoColor } from "@/utils/getYesNoColor";
import { FaTrash } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import deleteById from "@/pages/api/admin/category/delete";
import findCategoryById from "@/pages/api/admin/category/findById";
import findProductById from "@/pages/api/admin/product/findById";
import findUserById from "@/pages/api/admin/user/findById";
import { useEffect, useState } from "react";

interface CategoryProductProps {
    data: any;
    index: number;
    afterDelete: () => void;
}

const CategoryProductRecord: React.FC<CategoryProductProps> = ({ data, index, afterDelete}) => {
    const router = useRouter();
    const handleViewButtonClick = (id: string) => {
        router.push('/admin/category-product/' + id);
    };
    const [categoryName, setCategoryName] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [createdBy, setCreatedBy] = useState<string>('');
    const [updatedBy, setUpdatedBy] = useState<string>('');

    useEffect(() => {
        const init = async () => {
            const category = await findCategoryById(data.categoryId);
            setCategoryName(category.name);
            const product = await findProductById(data.productId);
            setProductName(product.name);
            const createdBy = await findUserById(data.createdBy);
            setCreatedBy(createdBy.firstName + ' ' + createdBy.lastName);
            const updatedBy = await findUserById(data.updatedBy);
            setUpdatedBy(updatedBy.firstName + ' ' + updatedBy.lastName);
        }
        init();
    }, [data])

    const handleDeleteButtonClick = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await deleteById(id);
                console.log("Deleted category product ID:", id);
                afterDelete();
            } catch (error) {
                console.error("Error when try to delete category product ID:", id, error);
            }
        } else {
            console.log("Cancel deleting category product ID:", id);
        }
    };    
    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 hover:bg-slate-300 text-center text-sm">
            <div className="flex-1 ml-4">{index}</div>
            <div className="flex-1 ml-4 hidden">{data.id}</div>
            <div className="flex-1 ml-4">{categoryName}</div>
            <div className="flex-1 ml-4">{productName}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.createdAt))}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.updatedAt))}</div>  
            <div className="flex-1 ml-4">{createdBy}</div>
            <div className="flex-1 ml-4">{updatedBy}</div>  
            <div className={`${getYesNoColor(data.isDeleted)} flex-1 ml-4`}>{data.isDeleted ? 'Yes' : 'No'}</div>
            <div className={`${getYesNoColor(data.isActive)} flex-1 ml-4`}>{data.isActive ? 'Yes' : 'No'}</div>
            <div className="flex-1 ml-4 cursor-pointer">
            <span className="flex items-center">
                {/* <IoIosInformationCircle onClick={() => handleViewButtonClick(data.id)} color="blue" className="mr-1 text-lg" /> */}
                <FaTrash color="red" onClick={() => handleDeleteButtonClick(data.id)} className="mr-1 text-lg" />
            </span>
            </div>
        </div>
    );
}

export default CategoryProductRecord;
