import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Dashboard/Authentication/Login.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "font-awesome/css/font-awesome.min.css";
import Home from "../src/Pages/Dashboard/Home/Home.jsx";
import Ads from "../src/Pages/Dashboard/Ads/Ads.jsx";
import Branches from "../src/Pages/Dashboard/Branches/Branches.jsx";
import Managers from "../src/Pages/Dashboard/Managers/Managers.jsx";
import Sales from "../src/Pages/Dashboard/Sales/Sales.jsx";
import SalesRepresentatives from "../src/Pages/Dashboard/SalesRepresentatives/SalesRepresentatives.jsx";
import Chefs from "../src/Pages/Dashboard/Chefs/Chefs.jsx";
import Details from "./Pages/Dashboard/Details/Details.jsx";
import NotFound from "./Pages/Dashboard/NotFound/NotFound.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/dashboard" element={<Dashboard />}>
            
            <Route path="/dashboard/home" element={<Home />} />
            <Route path="/dashboard/ads" element={<Ads />} />
            <Route path="/dashboard/branches" element={<Branches />} />
            <Route path="/dashboard/managers" element={<Managers />} />
            <Route path="/dashboard/sales" element={<Sales />} />
            <Route path="/dashboard/chefs" element={<Chefs/>} />
            <Route path="/dashboard/details" element={<Details/>} />
            <Route
              path="/dashboard/sales-representatives"
              element={<SalesRepresentatives />}
            />

          </Route>

          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
