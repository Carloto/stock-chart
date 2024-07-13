import {
  Box,
  CircularProgress,
  Container,
  LinearProgress,
} from "@mui/material";
import { useStock } from "contexts/stock.context";
import useStockData, { TimeSeries } from "hooks/use-stock-data.hook";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const transformToCandlestickData = (timeSeries: TimeSeries) => {
  return Object.keys(timeSeries).map((date) => {
    const dayData = timeSeries[date];
    return [
      new Date(date).getTime(),
      [dayData.open, dayData.high, dayData.low, dayData.close],
    ];
  });
};

function Graph() {
  const {
    state: { symbol },
  } = useStock();
  const { data, isLoading } = useStockData(symbol);
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    if (data && data["Time Series (Daily)"]) {
      const transformedData = transformToCandlestickData(
        data["Time Series (Daily)"]
      );
      setSeries([{ data: transformedData }]);
    }
  }, [data]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: symbol,
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
      },
    },
  };

  if (!data) return null;

  return (
    <Container maxWidth="xl" sx={{ height: 500 }}>
      {isLoading && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />{" "}
        </Box>
      )}
      {!isLoading && (
        <Chart
          type="candlestick"
          series={series}
          height={500}
          options={options}
        />
      )}
    </Container>
  );
}

export default Graph;
