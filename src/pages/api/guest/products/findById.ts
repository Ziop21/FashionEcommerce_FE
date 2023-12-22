import axios from "axios";

interface ProductId {
  id: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const findById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get("http://localhost:8081/api/guest/product/" + id);
    return response.data ;
  } catch (error) {
    console.error("Error in getting data!!! ", error);
    throw error;  
  }
};

export default findById;