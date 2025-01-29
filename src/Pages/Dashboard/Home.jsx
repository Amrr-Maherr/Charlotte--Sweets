import React, { useEffect, useState } from "react";
import OrderBox from "../../Components/OrderBox";
import axios from "axios";
import StatBox from "./StatBox";
import { DotLoader } from "react-spinners";
import ManagerBox from "./ManagerBox";
import AddReqBox from "../../Components/AddReqBox";
import { Link } from "react-router-dom";

function Home() {
  const [Orders, setOrders] = useState([]);
  const [sales,setsales] = useState([])
  const [managers,setmanagers] = useState([])
  const [TotalStatus, setTotalStatus] = useState([]);
  const [Managers, setManagers] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    if (token) {
      axios
        .get("https://management.mlmcosmo.com/api/orders-stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setOrders(response.data);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        })
        .catch((error) => {
          console.log(
            error.response ? error.response.data.message : error.message
          );
          setLoading(false);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get("https://management.mlmcosmo.com/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setTotalStatus(response.data);
        })
        .catch((error) => {
          console.log(
            error.response ? error.response.data.message : error.message
          );
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get("https://management.mlmcosmo.com/api/managers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setManagers(response.data);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        })
        .catch((error) => {
          console.log(error.response.data.message);
          setLoading(true);
        });
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      axios
        .get("https://management.mlmcosmo.com/api/sales", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setsales(response.data);
        })
        .catch(() => {});
    }
  }, [token]);
useEffect(() => {
    if (token) {
      axios
        .get("https://management.mlmcosmo.com/api/managers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setManagers(response.data);
        })
        .catch(() => {});
  }
},[token])
  return (
    <section>
      <div className="container">
        {loading ? (
          <div className="row vh-100 d-flex align-items-center justify-content-center">
            <div className="col-12 d-flex align-items-center justify-content-center">
              <DotLoader color={"#A8AFDF"} />
            </div>
          </div>
        ) : (
          <>
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
                      title="طلبات مرتجعه"
                      count={Orders.deliveredOrders}
                      icon={"fa-undo"}
                    />
                  </div>
                  <div className="col-xl-3 my-3 d-flex align-items-center justify-content-center">
                    <OrderBox
                      iconColor={"#A8AFDF"}
                      title="طلبات مرفوضه"
                      count={Orders.deliveredOrders}
                      icon={"fa-times-circle"}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="row  my-5 text-center d-flex align-items-center justify-content-between statistics-row">
              <div className="col-md-4 col-xl-3  col-12 ">
                <div className="stat-title">
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      textAlign: "right",
                      margin: "20px auto",
                    }}
                  >
                    الاحصائيات
                  </h2>
                </div>
                <StatBox
                  statTitle={"الفروع"}
                  num={TotalStatus.branches || 0}
                  icon={"fa-building"}
                  bgColor={"#D4C6F1"}
                />
                <StatBox
                  statTitle={"المديرين"}
                  num={TotalStatus.managers || 0}
                  icon={"fa-user"}
                  bgColor={"#FBC3CD"}
                />
                <StatBox
                  statTitle={"السيلز"}
                  num={TotalStatus.sales || 0}
                  icon={"fa-users"}
                  bgColor={"#FFE3B9"}
                />
                <StatBox
                  statTitle={"الطلبات"}
                  num={TotalStatus.orders || 0}
                  icon={"fa-cogs"}
                  bgColor={"#AEEDFB"}
                />
                <StatBox
                  statTitle={"الشيفات"}
                  num={TotalStatus.chefs || 0}
                  icon={"fa-mortar-board"}
                  bgColor={"#E4BCD5"}
                />
                <StatBox
                  statTitle={"الديليفري"}
                  num={TotalStatus.delivery || 0}
                  icon={"fa-truck"}
                  bgColor={"#A8AFDF"}
                />
              </div>

              <div className="col-md-4 col-xl-3  col-12 manager-stats-title d-flex align-items-center justify-content-center flex-column">
                <div>
                  <div className="text-end">
                    <h2
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        textAlign: "right",
                        margin: "20px auto",
                      }}
                    >
                      مديرين
                    </h2>
                  </div>
                  {Managers && Managers.length > 0 ? (
                    Managers.map((manager) => {
                      return (
                        <div key={manager.id}>
                          <ManagerBox
                            iconColor="#4AC8D9" // اللون الأول للأيقونات
                            iconColor2="#FFAE34" // اللون الثاني للأيقونات
                            bgColor="#EAECFF" // مثال على لون الخلفية
                            bgColor2="#FFE4BC" // اللون الثاني للخلفية
                            manager={manager}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p>No manager data available</p>
                  )}
                </div>
                <div>
                  <div className="text-end">
                    <h2
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        textAlign: "right",
                        margin: "20px auto",
                      }}
                    >
                      مديرين
                    </h2>
                  </div>
                  {Managers && Managers.length > 0 ? (
                    Managers.map((manager) => {
                      return (
                        <div key={manager.id}>
                          <ManagerBox
                            iconColor="#4AC8D9" // اللون الأول للأيقونات
                            iconColor2="#FFAE34" // اللون الثاني للأيقونات
                            bgColor="#EAECFF" // مثال على لون الخلفية
                            bgColor2="#FFE4BC" // اللون الثاني للخلفية
                            manager={manager}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p>No manager data available</p>
                  )}
                </div>
              </div>
              <div className="col-md-4 col-xl-3  col-12 add-requests-title my-5">
                <div className="d-flex  justify-content-between my-3">
                  <Link
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                        color: "#A9411D",
                      textDecoration:"none"
                    }}
                  >
                    شاهد الكل
                  </Link>
                  <h5
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#000000",
                    }}
                  >
                    طلبات الاضافه
                  </h5>
                </div>
                <div className="bg-white">
                  <AddReqBox
                    managers={Managers.slice(0, 5)} // عرض أول 5 مديرين فقط
                    sales={sales.slice(0, 5)} // عرض أول 5 سيلز فقط
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Home;
