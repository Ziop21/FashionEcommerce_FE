import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { getYesNoColor } from "@/utils/getYesNoColor";
import { FaTrash } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import deleteById from "@/pages/api/admin/user/delete";
import findById from "@/pages/api/admin/user/findById";
import findUserLevelById from '@/pages/api/admin/user/level/findById'
import { Role, User } from "@/pages/api/admin/user/Models";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { useEffect, useState } from "react";
import findUserById from '@/pages/api/admin/user/findById';

interface UserProps {
    data: any;
    index: number;
    afterDelete: () => void;
}

const UserRecord: React.FC<UserProps> = ({ data, index, afterDelete }) => {
    const [userLevel, setUserLevel] = useState<string>('');
    const [updatedBy, setUpdatedBy] = useState<string>('');

    useEffect(() => {
        const init = async () => {
            if (data.updatedBy !== null && data.updatedBy !== undefined){
                const updatedBy = await findUserById(data.updatedBy);
                setUpdatedBy(updatedBy.firstName + ' ' + updatedBy.lastName);
            }
            if (data.userLevelId !== null && data.userLevelId !== undefined){
                const respone = await findUserLevelById(data.userLevelId);
                setUserLevel(respone.name);
            }
        }
        init();
    }, [data])

    const router = useRouter();

    const handleViewButtonClick = (id: string) => {
        router.push('/admin/user/' + id);
    };

    const handleDeleteButtonClick = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                const fetchedUser: User = await findById(id);
                console.log('usser', fetchedUser)
                if (fetchedUser.avatar) {
                    const oldImageRef = ref(storage, `images/user/${fetchedUser.avatar}`)
                    const oldImageURL = await getDownloadURL(oldImageRef);
                    if (oldImageURL) {
                        await deleteObject(oldImageRef);
                    }
                }
                await deleteById(id);
                console.log("Deleted user ID:", id);
                afterDelete();
            } catch (error) {
                console.error("Error when try to delete user ID:", id, error);
            }
        } else {
            console.log("Cancel deleting user ID:", id);
        }
    };

    return (
        <div className="flex items-center border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 hover:bg-slate-300 text-center text-sm">
            <div className="flex-1 ml-4">{index}</div>
            <div className="flex-1 ml-4 hidden">{data.id}</div>
            <div className="flex-1 ml-4">{data.roles.map((role: Role) => { return role.name + ' ' })}</div>
            <div className="flex-1 ml-4">{data.firstName}</div>
            <div className="flex-1 ml-4">{data.lastName}</div>
            <div className={`${getYesNoColor(data.isEmailActive)} flex-1 ml-4`}>{data.isEmailActive ? 'Yes' : 'No'}</div>
            <div className={`${getYesNoColor(data.isPhoneActive)} flex-1 ml-4`}>{data.isPhoneActive ? 'Yes' : 'No'}</div>
            <div className="flex-1 ml-4">{data.point}</div>
            <div className="flex-1 ml-4">{userLevel ?? ''}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.createdAt))}</div>
            <div className="flex-1 ml-4">{formatDate(new Date(data.updatedAt))}</div>
            <div className="flex-1 ml-4">{updatedBy ?? ''}</div>
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

export default UserRecord;
