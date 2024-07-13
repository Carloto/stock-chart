import {
  Autocomplete,
  Box,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useStock } from "contexts/stock.context";
import useDebounce from "hooks/use-debounce.hook";
import useSearchStock, { BestMatch } from "hooks/use-search-stock.hook";
import { useEffect, useState } from "react";

function Header() {
  const { dispatch } = useStock();
  const [value, setValue] = useState<BestMatch | null>(null);
  const [debouncedValue, inputValue, setInputValue] = useDebounce<string>(
    "",
    1000
  );
  const { searchResults } = useSearchStock(debouncedValue);

  useEffect(() => {
    if (value === null) return;
    dispatch({ type: "setSymbol", payload: value["1. symbol"] });
  }, [value]);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h3" align="center" mb={4}>
        Stock Chart
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Autocomplete
          size="small"
          value={value}
          onChange={(event: any, newValue: BestMatch | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          disablePortal
          id="search-stock-autocomplete"
          options={searchResults}
          getOptionKey={(option) => option["1. symbol"]}
          getOptionLabel={(option) => option["1. symbol"]}
          sx={{ width: "100%", maxWidth: 400 }}
          filterOptions={(x) => x}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                component="li"
                {...optionProps}
              >
                <Typography width="60%" fontWeight={500}>
                  {option["1. symbol"]}
                </Typography>
                <Typography
                  color="text.secondary"
                  fontSize={12}
                  sx={{ width: "40%" }}
                >
                  {option["2. name"]}
                </Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Search stock" />
          )}
          isOptionEqualToValue={(option, value) =>
            option["1. symbol"] === value["1. symbol"]
          }
        />
      </Box>
    </Container>
  );
}

export default Header;
