import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Dashboard/Authentication/Login.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "font-awesome/css/font-awesome.min.css";
import Home from "./Pages/Dashboard/Home/Home.jsx";
import Ads from "./Pages/Dashboard/Ads/Ads.jsx";
import Branches from "./Pages/Dashboard/Branches/Branches.jsx";
import Managers from "./Pages/Dashboard/Managers/Managers.jsx";
import Sales from "./Pages/Dashboard/Sales/Sales.jsx";
import SalesRepresentatives from "./Pages/Dashboard/SalesRepresentatives/SalesRepresentatives.jsx";
import Chefs from "./Pages/Dashboard/Chefs/Chefs.jsx";
import Details from "./Pages/Dashboard/Details/Details.jsx";
import NotFound from "./Pages/Dashboard/NotFound/NotFound.jsx";
import BranchDetails from "./Pages/Dashboard/Branches/BranchDetails/BranchDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="ads" element={<Ads />} />
            <Route path="branches" element={<Branches />} />
            <Route path="managers" element={<Managers />} />
            <Route path="sales" element={<Sales />} />
            <Route path="chefs" element={<Chefs />} />
            <Route path="details/:id" element={<Details />} />
            <Route
              path="/dashboard/branch-details/:id"
              element={<BranchDetails />}
            />
            <Route
              path="sales-representatives"
              element={<SalesRepresentatives />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
