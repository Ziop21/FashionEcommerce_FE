import api from "../api";

import { API_BACKEND_URL } from "@/config/ApplicationConfig";

const API_BASE_URL = API_BACKEND_URL;

interface CheckOutReq {
  username: string;
  address : string;
  phone : string;
  shippingFee : number;
  deliveryId : string;
  isPaidBefore : boolean
}

const CheckOut = async (checkoutReq: CheckOutReq) => {
    try {
      const response = await api.post('/api/guest/order', checkoutReq);
      console.log(response)
      return response;
    } catch (error) {
      throw error;
    }
  };

export default CheckOut;