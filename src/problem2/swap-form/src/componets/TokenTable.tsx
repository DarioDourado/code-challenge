import React, { useEffect, useState } from "react";
import axios from "axios";
import { TokenData } from "./Interfaces";


const fetchTokenPrices = async (): Promise<TokenData[]> => {
  try {
    const response = await axios.get(
      "https://interview.switcheo.com/prices.json" // .env BASE_JSON_URL
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return [];
  }
};

const TokenTable: React.FC = () => {
  const [data, setData] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [icons, setIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await fetchTokenPrices();
        setData(prices);
      } catch (error) {
        setError("Erro ao carregar os preços dos tokens.");
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  useEffect(() => {
    const loadIcons = async () => {
      const iconsMap: Record<string, string> = {};
      for (const item of data) {
        const url = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`; // .env BASE_TOKENS_URL
        try {
          await axios.get(url);
          iconsMap[item.currency] = url;
        } catch {
          iconsMap[item.currency] = "src/problem2/swap-form/public/logo512.png";
        }
      }
      setIcons(iconsMap);
    };

    if (!loading && !error) {
      loadIcons();
    }
  }, [data, loading, error]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Token Prices</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2 border-b">Currency</th>
            <th className="px-4 py-2 border-b">Price</th>
          </tr>
        </thead>
        <tbody className="">
          {data.map((item) => (
            <tr key={item.currency} className="">
              <td className="px-4 py-2 border-b flex items-center space-x-2">
                <img
                  src={
                    icons[item.currency] ||
                    "src/problem2/swap-form/public/logo512.png"
                  }
                  alt={item.currency}
                  className="w-6 h-6"
                />
                <span>{item.currency}</span>
              </td>
              <td className="px-4 py-2 border-b text-center">
                {item.price.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;
