import { JWT_CART } from "@/config/ApplicationConfig";
import api from "../api";
import Cookies from 'js-cookie';

interface CheckOutReq {
  username: string;
  address: string;
  phone: string;
  shippingFee: number;
  deliveryId: string;
  isPaidBefore: boolean;
  cartToken?: string;
}

const CheckOut = async (checkoutReq: CheckOutReq) => {
  try {
    const jwtCart = Cookies.get(JWT_CART)
    if (jwtCart) {
      checkoutReq.cartToken = jwtCart;
    }
    else {
      checkoutReq.cartToken = '';
    }
    const response = await api.post('/api/guest/order', checkoutReq);
    console.log(response)
    return response;
  } catch (error) {
    throw error;
  }
};

export default CheckOut;