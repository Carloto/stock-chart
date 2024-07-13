import { createContext, ReactNode, useContext, useReducer } from "react";

type Action = { type: "setSymbol"; payload: string };
type Dispatch = (action: Action) => void;
type State = { symbol: string };
type StockProviderProps = { children: ReactNode };

const StockStateContext = createContext<{
  state: State;
  dispatch: Dispatch;
} | null>(null);

const stockReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setSymbol": {
      return { ...state, symbol: action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};

const StockProvider = ({ children }: StockProviderProps) => {
  const [state, dispatch] = useReducer(stockReducer, { symbol: "" });
  const value = { state, dispatch };

  return (
    <StockStateContext.Provider value={value}>
      {children}
    </StockStateContext.Provider>
  );
};

function useStock() {
  const context = useContext(StockStateContext);
  if (context === null) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
}

export { StockProvider, useStock };
