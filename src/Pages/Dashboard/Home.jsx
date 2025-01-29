import React, { useEffect, useState } from "react";
import OrderBox from "../../Components/OrderBox";
import Chart from "../../Pages/Dashboard/Chart";
import axios from "axios";

function Home() {
  const [Orders, setOrders] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    if (token) {
      axios
        .get("https://management.mlmcosmo.com/api/orders-stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
          setOrders(response.data); // هنا نضبط الـ response في الـ state
        })
        .catch((error) => {
          console.log(
            error.response ? error.response.data.message : error.message
          );
        });
    } else {
      console.log("توكن المستخدم غير موجود");
    }
  }, [token]);

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 100 },
    { name: "Group F", value: 100 },
  ];

  return (
    <section>
      <div className="container">
        <div className="row my-5 text-center d-flex align-items-center justify-content-center">
          {Orders && (
            <>
              <div className="col-xl-3 my-3 d-flex align-items-center justify-content-center">
                <OrderBox
                  title="طلبات جديدة"
                  count={Orders.newOrders}
                  iconColor={"#D4C6F1"}
                  icon={"fa-shopping-cart"}
                />
              </div>
              <div className="col-xl-3 my-3 d-flex align-items-center justify-content-center">
                <OrderBox
                  title="طلبات مكتملة"
                  count={Orders.completedOrders}
                  iconColor={"#FBC3CD"}
                  icon={"fa-check-circle"}
                />
              </div>
              <div className="col-xl-3 my-3 d-flex align-items-center justify-content-center">
                <OrderBox
                  title="طلبات معلقة"
                  count={Orders.pendingOrders}
                  iconColor={"#FFE3B9"}
                  icon={"fa-hourglass-half"}
                />
              </div>
              <div className="col-xl-3 my-3 d-flex align-items-center justify-content-center">
                <OrderBox
                  iconColor={"#AEEDFB"}
                  title="طلبات تم تسليمها"
                  count={Orders.deliveredOrders}
                  icon={"fa-truck"}
                />
              </div>
              <div className="col-xl-3 my-3 d-flex align-items-center justify-content-center">
                <OrderBox
                  iconColor={"#E4BCD5"}
                  title="طلبات  مرتجعه"
                  count={Orders.deliveredOrders}
                  icon={"fa-undo"}
                />
              </div>
              <div className="col-xl-3 my-3 d-flex align-items-center justify-content-center">
                <OrderBox
                  iconColor={"#A8AFDF"}
                  title="طلبات  مرفوضه"
                  count={Orders.deliveredOrders}
                  icon={"fa-times-circle"}
                />
              </div>
            </>
          )}
        </div>
        <div className="row text-center d-flex align-items-center justify-content-between">
          <div className="col-4">احصائيات مديرين</div>
          <div className="col-4">
            <Chart data={data} />
          </div>
          <div className="col-4">
            <h1>طلبات الاضافه</h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
