import api from "@/pages/api/api";

const deleteById = async (id: string) => {
  try {
    const response = await api.delete('/api/customer/follow/' + id);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default deleteById;
