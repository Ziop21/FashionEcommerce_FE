import { JWT_CART } from "@/config/ApplicationConfig";
import api from "@/pages/api/api";
import Cookies from 'js-cookie';

export interface InsertToCartProps {
    stockId: string;
    quantity: number;
}

const InsertToCart = async (insertToCartProps: InsertToCartProps) => {
  try {
    const jwtCart = Cookies.get(JWT_CART)
    if (jwtCart) {
      await api.post(`/api/guest/cart/add/${insertToCartProps.stockId}?quantity=${insertToCartProps.quantity}`, {
        cartToken: jwtCart,
        cartItems: null,
      });
    }
   

  } catch (error) {
    throw error;
  }
};

export default InsertToCart;
