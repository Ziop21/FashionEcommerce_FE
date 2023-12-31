
import api from "../api";

const GetCategoryName = async (productId: string) => {
  try {
    const response = await api.get('/api/guest/category/product/' + productId, {
    });
    const categoryNames = Promise.all(response.data.items.map(async (item: any) => {
      const response2 = await api.get('/api/guest/category/' + item.categoryId);
      return response2.data.name;
    }))
    
    return categoryNames;
  } catch (error) {
    console.error("Can not get data from API route");
    throw error;
  }
};

export default GetCategoryName;
