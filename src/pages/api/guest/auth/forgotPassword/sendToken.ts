import api from "@/pages/api/api";

const sendToken =  async (email: string) => {
  try {
    const response = await api.post('/api/guest/auth/forgot-password/send-token/' + email);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Can't get data from API");
    throw error;  
  }
};

export default sendToken;
