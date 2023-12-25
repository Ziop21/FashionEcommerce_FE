import api from "@/pages/api/api";

const verifyEmailToken =  async (token: string) => {
  try { 
    const response = await api.post('/api/guest/auth/register/verify?token=' + token);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Can't get data from API");
    throw error;  
  }
};

export default verifyEmailToken;
