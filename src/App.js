import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Dashboard/Authentication/Login.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Home from "./Pages/Dashboard/Home/Home.jsx";
import Ads from "./Pages/Dashboard/Ads/Ads.jsx";
import Branches from "./Pages/Dashboard/Branches/Branches.jsx";
import Managers from "./Pages/Dashboard/Managers/Managers.jsx";
import Sales from "./Pages/Dashboard/Sales/Sales.jsx";
import SalesRepresentatives from "./Pages/Dashboard/SalesRepresentatives/SalesRepresentatives.jsx";
import Chefs from "./Pages/Dashboard/Chefs/Chefs.jsx";
import Details from "../src/Pages/Dashboard/Details/ManagerDetails.jsx";
import NotFound from "./Pages/Dashboard/NotFound/NotFound.jsx";
import BranchDetails from "./Pages/Dashboard/Branches/BranchDetails/BranchDetails.jsx";
import SalesDetails from "./Pages/Dashboard/Sales/SalesDetails.jsx";
import Specialties from "./Pages/Dashboard/Specialties/Specialties.jsx";
import Roses from "./Pages/Dashboard/Roses/Roses.jsx";
import Products from "./Pages/Dashboard/Products/Products.jsx";
import ChefsDetails from "./Pages/Dashboard/Chefs/ChefsDetails.jsx";
import AdDetails from "./Pages/Dashboard/Ads/AdDetails/AdDetails.jsx";
import SalesRepresentativesDetails from "./Pages/Dashboard/SalesRepresentativesDetails/SalesRepresentativesDetails.jsx";
import NewOrders from "./Pages/Dashboard/NewOrders/NewOrders.jsx";
import CompleteOrders from "./Pages/Dashboard/CompleteOrders/CompleteOrders.jsx";
import DeliveredOrders from "./Pages/Dashboard/DeliveredOrders/DeliveredOrders.jsx";
import RejectedOrders from "./Pages/Dashboard/RejectedOrders/RejectedOrders.jsx";
import ReturnedOrders from "./Pages/Dashboard/ReturnedOrders/ReturnedOrders.jsx";
import PendingOrders from "./Pages/Dashboard/PendingOrders/PendingOrders.jsx";
import OrderDetails from "./Pages/Dashboard/OrderDetails/OrderDetails.jsx";
import AllRequests from "./Pages/Dashboard/AllRequests/AllRequests.jsx";
import Profile from "./Pages/Dashboard/Profile/Profile.jsx";
import PaymentReports from "./Pages/Dashboard/PaymentReports/PaymentReports.jsx";
import Business from "./Pages/Dashboard/Business/Business.jsx";

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
            <Route path="specialties" element={<Specialties />} />
            <Route path="flowers" element={<Roses />} />
            <Route path="products" element={<Products />} />
            <Route path="new-orders" element={<NewOrders />} />
            <Route path="complete-orders" element={<CompleteOrders />} />
            <Route path="rejected-orders" element={<RejectedOrders />} />
            <Route path="returned-orders" element={<ReturnedOrders />} />
            <Route path="pending-orders" element={<PendingOrders />} />
            <Route path="delivered-orders" element={<DeliveredOrders />} />
            <Route path="all-requests" element={<AllRequests />} />
            <Route path="payment-reports" element={<PaymentReports/>} />
            <Route path="profile" element={<Profile />} />
            <Route path="business" element={<Business />} />
            <Route
              path="/dashboard/manager-details/:id"
              element={<Details />}
            />
            <Route
              path="/dashboard/sales-details/:id"
              element={<SalesDetails />}
            />
            <Route
              path="/dashboard/branch-details/:id"
              element={<BranchDetails />}
            />
            <Route
              path="/dashboard/order-details/:id"
              element={<OrderDetails />}
            />
            <Route
              path="sales-representatives"
              element={<SalesRepresentatives />}
            />
            <Route
              path="sales-representatives-details/:id"
              element={<SalesRepresentativesDetails />}
            />
            <Route
              path="/dashboard/chef-details/:id"
              element={<ChefsDetails />}
            />
            <Route path="/dashboard/add-details/:id" element={<AdDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
