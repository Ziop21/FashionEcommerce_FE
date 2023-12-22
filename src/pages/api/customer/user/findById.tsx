import api from "@/pages/api/api";

const findById = async () => {
  try {
    const response = await api.get('/api/customer/user');
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findById;