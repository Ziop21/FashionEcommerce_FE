import api from "../../api";

const findById = async (id: string) => {
  try {
    const response = await api.get("/api/guest/product/" + id);
    return response.data ;
  } catch (error) {
    console.error("Error in getting data!!! ", error);
    throw error;  
  }
};

export default findById;