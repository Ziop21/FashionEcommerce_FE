import api from "@/pages/api/api";

const findEmail =  async (token: string) => {
  try {
    const response = await api.post('/api/guest/auth/forgot-password/find-email?token=' + token);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Can't get data from API");
    throw error;  
  }
};

export default findEmail;
