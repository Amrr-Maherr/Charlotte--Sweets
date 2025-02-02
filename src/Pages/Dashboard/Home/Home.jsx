import { useEffect, useState } from "react";
import OrderBox from "../../../Components/HomeOrderBox/OrderBox"
import axios from "axios";
import Loader from "../Loader/Loader"
function Home() {
  const [Orders, setOrders] = useState({})
  const [loading,setLoading] = useState(true)
  const token = JSON.parse(localStorage.getItem("AuthToken"))
  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/orders-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLoading(false)
        setOrders(response.data)
      })
      .catch((error) => {
        setLoading(true)
      });
  },[token])
  return (
    <>
      <section>
        {loading ? (
          <><Loader/></>
        ) : (
          <>
            <div className="container">
              <div className="row d-flex justify-content-center my-4">
                <div className="col-xl-3 my-3">
                  <OrderBox
                    icon="fa-check-circle"
                    iconBg="#FFE3B9"
                    orderStatus="الطلبات المكتمله"
                    orderNumber={Orders.completedOrders}
                  />
                </div>
                <div className="col-xl-3 my-3">
                  <OrderBox
                    icon="fa-times-circle"
                    iconBg="#E4BCD5"
                    orderStatus="الطلبات المرفوضه"
                    orderNumber={Orders.declinedOrders}
                  />
                </div>
                <div className="col-xl-3 my-3">
                  <OrderBox
                    icon="fa-truck"
                    iconBg="#D4C6F1"
                    orderStatus="الطلبات الموصله"
                    orderNumber={Orders.deliveredOrders}
                  />
                </div>
                <div className="col-xl-3 my-3">
                  <OrderBox
                    icon="fa-plus-circle"
                    iconBg="#AEEDFB"
                    orderStatus="الطلبات الجديده"
                    orderNumber={Orders.newOrders}
                  />
                </div>
                <div className="col-xl-3 my-3">
                  <OrderBox
                    icon="fa-clock-o"
                    iconBg="#FBC3CD"
                    orderStatus="الطلبات المعلقه"
                    orderNumber={Orders.pendingOrders}
                  />
                </div>
                <div className="col-xl-3 my-3">
                  <OrderBox
                    icon="fa-undo"
                    iconBg="#A8AFDF"
                    orderStatus="الطلبات المرتجعه"
                    orderNumber={Orders.returnedOrders}
                  />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-12"></div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
export default Home