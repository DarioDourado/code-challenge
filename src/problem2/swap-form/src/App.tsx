import React from "react";
import CurrencySwapForm from "./componets/CurrenceySwapForm";
import { Token } from "@mui/icons-material";
import TokenTable from "./componets/TokenTable";

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fancy Currency Swap</h1>
      <CurrencySwapForm />
      <TokenTable />
    </div>
  );
};

export default App;
