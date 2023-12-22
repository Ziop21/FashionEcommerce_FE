import api from "@/pages/api/api";

const add = async (categoryProduct: CategoryProduct) => {
  try {
    const response = await api.post('/api/admin/manager/category-product', categoryProduct);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
