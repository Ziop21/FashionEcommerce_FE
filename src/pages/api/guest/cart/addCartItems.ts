import { JWT_CART } from "@/config/ApplicationConfig";
import api from "@/pages/api/api";
import Cookies from 'js-cookie';

export interface cartItem {
  stockId: string;
  quantity: number;
}
export interface AddCartItemsProps {
  cartItems: cartItem[]
}

const AddCartItems = async (AddCartItemsProps: AddCartItemsProps) => {
  try {
    const jwtCart = Cookies.get(JWT_CART)
    if (jwtCart) {
      await api.post(`/api/guest/cart/addCartItems`, {
        cartItems: AddCartItemsProps.cartItems,
        cartToken: jwtCart,
      }
      );
    }
    // console.log("AddCartItemsProps.cartItems", AddCartItemsProps.cartItems);

    // console.log("AddCartItemsProps.cartItems", AddCartItemsProps.cartItems);
  } catch (error) {
    throw error;
  }
};

export default AddCartItems;
