import api from "@/pages/api/api";
import { ChangePasswordRequest } from "./Models";

const customerDeleteUser = async (ChangePasswordRequest: ChangePasswordRequest) => {
  console.log('ChangePasswordRequest', ChangePasswordRequest)
  try {   
    const response = await api.put('/api/customer/user/delete', ChangePasswordRequest);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default customerDeleteUser;
