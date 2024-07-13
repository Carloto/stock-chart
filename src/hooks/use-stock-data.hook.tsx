import axios from "axios";
import { API_KEY } from "../constants";
import { useState, useEffect } from "react";

type MetaData = {
  "1. Information": string;
  "2. Symbol": string;
  "3. Last Refreshed": string;
  "4. Output Size": string;
  "5. Time Zone": string;
};

type TimeSeriesData = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type TimeSeries = {
  [date: string]: TimeSeriesData;
};

type StockData = {
  "Meta Data": MetaData;
  "Time Series (Daily)": TimeSeries;
};

type ApiResponse = StockData | null;

type UseStockData = {
  data: ApiResponse;
  isLoading: boolean;
};

const transformData = (data: any): StockData => {
  const transformedData: StockData = {
    "Meta Data": data["Meta Data"],
    "Time Series (Daily)": {},
  };

  for (const date in data["Time Series (Daily)"]) {
    const dayData = data["Time Series (Daily)"][date];
    transformedData["Time Series (Daily)"][date] = {
      open: parseFloat(dayData["1. open"]),
      high: parseFloat(dayData["2. high"]),
      low: parseFloat(dayData["3. low"]),
      close: parseFloat(dayData["4. close"]),
      volume: parseInt(dayData["5. volume"]),
    };
  }

  return transformedData;
};

const useStockData = (symbol: string): UseStockData => {
  const [data, setData] = useState<ApiResponse>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!symbol) return;

    (async () => {
      setIsLoading(true);

      try {
        const { data } = await axios.get(`https://www.alphavantage.co/query`, {
          params: new URLSearchParams([
            ["function", "TIME_SERIES_DAILY"],
            ["symbol", symbol],
            ["apikey", API_KEY],
          ]),
        });
        const transformedResult = transformData(data);

        setData(transformedResult);
      } catch (err) {
        console.error("Failed to fetch stock data", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [symbol]);

  return { data, isLoading };
};

export default useStockData;
