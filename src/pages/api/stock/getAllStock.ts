import api from "../api";

const GetStockById = async (productId: string) => {
  try {
    const response = await api.get('/api/guest/stock/product/' + productId, {
    });
    return response.data.items;
  } catch (error) {
    console.error("Can not get data from API route");
    throw error;
  }
};

export default GetStockById;