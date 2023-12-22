import axios from "axios";
import api from "../api";

const GetStockId = async (productId: string, colorId: string, sizeId: string) => {
  try {
    const response = await axios.get('http://localhost:8081/api/guest/stock', {
      params: {
        productId,
        colorId,
        sizeId,
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Can not get data from API route");
    throw error;
  }
};

export default GetStockId;
