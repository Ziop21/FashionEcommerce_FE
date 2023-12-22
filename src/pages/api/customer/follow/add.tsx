import api from "@/pages/api/api";

const add = async (productId: string) => {
  try {
    const response = await api.post('/api/customer/follow/' + productId);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
