import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "font-awesome/css/font-awesome.min.css";
import Home from "./Pages/Dashboard/Home";
import Ads from "./Pages/Dashboard/Ads";
import Branches from "./Pages/Dashboard/Branches";
import Managers from "./Pages/Dashboard/Managers";
import Sales from "./Pages/Dashboard/Sales";
import SalesRepresentatives from "./Pages/Dashboard/SalesRepresentatives.jsx";
import Chefs from "./Pages/Dashboard/Chefs";

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
            <Route
              path="/dashboard/sales-representatives"
              element={<SalesRepresentatives />}
            />

          </Route>

          <Route path="*" element={<h1>404 - الصفحة غير موجودة</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
