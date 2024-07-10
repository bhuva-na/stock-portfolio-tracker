import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register";
import Login from "./components/Login";
import AutoComplete_alternative from "./components/alternative";
import RealTimeData from "./components/realTimeData";
import StockChart from "./components/StockChat";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/Autocomplete-alternative",
      element: <AutoComplete_alternative />,
    },
    {
      path: "/RealTimeData/:stock",
      element: <RealTimeData />,
    },
    {
      path: "/stock-chart",
      element: <StockChart />,
    },
  ]);
  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
