import api from "@/pages/api/api";
import { Review } from "../../guest/stock/Models";

const addReview = async (stockId: string | undefined, review: Review) => {
  try {
    const response = await api.put('/api/customer/stock/' + stockId, review);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default addReview;
