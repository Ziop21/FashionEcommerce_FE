import api from "../api";

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