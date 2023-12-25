import api from "@/pages/api/api";

interface ParamProps {
  search?: string;
}

const findAll = async (params: ParamProps) => {
  try {
    const response= await api.get('/api/customer/follow', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
