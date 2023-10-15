import axios, { AxiosError } from "axios";

const client = {
  search: async (query: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/hello`);
      return response.data;
    } catch (error: any) {
      console.error("AxiosError:", error.message);
      throw error;
    }
  },
};

export default client;
