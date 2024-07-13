import axios from "axios";
import { useEffect, useState } from "react";
import { API_KEY } from "../constants";

export interface BestMatch {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
}

interface SearchResults {
  bestMatches: BestMatch[];
}

function useSearchStock(term: string | null) {
  const [searchResults, setSearchResults] = useState<BestMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!term) return;

    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<SearchResults>(
          `https://www.alphavantage.co/query`,
          {
            params: new URLSearchParams([
              ["function", "SYMBOL_SEARCH"],
              ["keywords", term],
              ["apikey", API_KEY],
            ]),
          }
        );
        setSearchResults(data.bestMatches);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [term]);

  return { searchResults, loading };
}

export default useSearchStock;
