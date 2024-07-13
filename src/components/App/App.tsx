import { StockProvider } from "contexts/stock.context";
import Header from "components/Header";
import Graph from "components/Graph";

function App() {
  return (
    <>
      <StockProvider>
        <Header />
        <Graph />
      </StockProvider>
    </>
  );
}

export default App;
