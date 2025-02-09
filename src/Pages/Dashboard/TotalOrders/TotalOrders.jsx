import axios from "axios"
import { useEffect, useState } from "react"
import "../../../Style/TotalOrders/TotalOrders.css"
import eye from "../../../Assets/eye.svg"
import Loader from "../Loader/Loader"
import { Link } from "react-router-dom"
function TotalOrders() {
    const token = JSON.parse(localStorage.getItem("AuthToken"))
    const [Data, setData] = useState([])
    const [loading,setLoading]= useState(true)
    const getData = () => {
        axios
          .get("https://management.mlmcosmo.com/api/orders",{headers:{Authorization:`Bearer ${token}`}})
            .then((response) => {
                setData(response.data)
                setLoading(false)
          })
            .catch((error) => {
                console.log(error.response.data.message);
                setLoading(true)
          });
    }
    useEffect(() => {
        getData()
    },[token])
    return (
      <>
        <section>
          {loading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <div className="container order-container">
                <div className="row order-row">
                  <div className="col-12 order-col mt-5">
                    <h1 className="orders-title">الطلبات</h1>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="table-responsive">
                      <table class="table table-hover text-center orders-table">
                        <thead>
                          <tr>
                            <th scope="col">عرض تفاصيل</th>
                            <th scope="col">السعر الكلي</th>
                            <th scope="col">حاله الطلب</th>
                            <th scope="col">الطلب</th>
                            <th scope="col">رقم الطلب</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Data.length === 0 ? (
                              <><tr>
                              <td colSpan="12">لايوجد طلبات حاليه</td>
                              </tr></>
                          ) : (
                            <>
                              {Data.map((order) => (
                                <>
                                  <tr key={order.id}>
                                    <td>
                                      <div className="actions">
                                        <Link to={`/dashboard/order-details/${order.id}`}>
                                          <img src={eye} alt="" />
                                        </Link>
                                      </div>
                                    </td>
                                    <td>{order.price}</td>
                                    <td>{order.status}</td>
                                    <td>{order.order_type}</td>
                                    <td>{order.id}</td>
                                  </tr>
                                </>
                              ))}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </>
    );
}
export default TotalOrders