import api from "@/pages/api/api";

const findById = async (id: string) => {
  try {
    const response = await api.get('/api/guest/stock/' + id );
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findById;