import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchTokenPrices } from "../services/api";
import { TextField, Button, MenuItem } from "@mui/material";

interface FormInputs {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

interface TokenData {
  currency: string;
  price: number;
}

const getIconUrl = (currency: string): string => {
  const baseUrl =
    "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";
  const formattedCurrency = currency.replace(/ /g, "-").toUpperCase();

  return `${baseUrl}${formattedCurrency}.svg`;
};

const CurrencySwapForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>();

  const [tokenPrices, setTokenPrices] = useState<TokenData[]>([]);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const fromCurrency = watch("fromCurrency");
  const toCurrency = watch("toCurrency");
  const amount = watch("amount");

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await fetchTokenPrices();
        const uniqueTokens = Array.from(
          new Map(prices.map((item) => [item.currency, item])).values()
        );
        setTokenPrices(uniqueTokens);
      } catch (error) {
        console.error("Failed to fetch token prices", error);
      }
    };

    loadPrices();
  }, []);

  const onSubmit = (data: FormInputs) => {
    if (fromCurrency && toCurrency && amount) {
      const fromPrice = tokenPrices.find(
        (token) => token.currency === fromCurrency
      )?.price;
      const toPrice = tokenPrices.find(
        (token) => token.currency === toCurrency
      )?.price;

      if (fromPrice && toPrice) {
        const convertedValue = (amount * fromPrice) / toPrice;
        setConvertedAmount(convertedValue);
        setConversionError(null);
      } else {
        setConversionError(
          "Conversion rates for the selected currencies are not available."
        );
        setConvertedAmount(null);
      }
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            select
            label="From Currency"
            {...register("fromCurrency", { required: true })}
            error={!!errors.fromCurrency}
            helperText={errors.fromCurrency ? "This field is required" : ""}
            fullWidth
          >
            {tokenPrices.map((token) => (
              <MenuItem
                key={token.currency}
                value={token.currency}
                className="flex items-center space-x-2"
              >
                <img
                  src={getIconUrl(token.currency)}
                  alt={token.currency}
                  className="w-6 h-6"
                />
                <span>
                  {token.currency} - {token.price.toFixed(4)}
                </span>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="To Currency"
            {...register("toCurrency", { required: true })}
            error={!!errors.toCurrency}
            helperText={errors.toCurrency ? "This field is required" : ""}
            fullWidth
          >
            {tokenPrices.map((token) => (
              <MenuItem
                key={token.currency}
                value={token.currency}
                className="flex items-center space-x-2"
              >
                <img
                  src={getIconUrl(token.currency)}
                  alt={token.currency}
                  className="w-6 h-6"
                />
                <span>
                  {token.currency} - {token.price.toFixed(4)}
                </span>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Amount"
            type="number"
            {...register("amount", { required: true })}
            error={!!errors.amount}
            helperText={errors.amount ? "This field is required" : ""}
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Swap
          </Button>
        </form>
      </div>
      <div className="flex justify-center items-center w-1/2">
        {convertedAmount !== null && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Converted Amount:</h2>
            <p className="text-lg">
              {amount} {fromCurrency} = {convertedAmount.toFixed(4)}{" "}
              {toCurrency}
            </p>
          </div>
        )}
        {conversionError && (
          <div className="mt-4 text-red-600">{conversionError}</div>
        )}
      </div>
    </div>
  );
};

export default CurrencySwapForm;
