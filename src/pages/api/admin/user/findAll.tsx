import api from "@/pages/api/api";

interface ParamProps {
  search?: string;
  isEmailActive?: boolean;
  isDeleted?: boolean;
  isPhoneActive?: boolean;
  userLevelIds?: string[];
  fromDate?: Date;
  toDate?: Date;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps) => {
  try {
    const response = await api.get('/api/admin/manager/user', {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
