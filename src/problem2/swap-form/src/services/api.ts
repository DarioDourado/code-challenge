import axios from "axios";

interface TokenData {
  currency: string;
  price: number;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const fetchTokenPrices = async (): Promise<TokenData[]> => {
  try {
    const response = await api.get(
      "https://interview.switcheo.com/prices.json"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    throw error;
  }
};
