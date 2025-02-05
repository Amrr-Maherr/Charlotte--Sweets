import { useEffect, useState } from "react";
import "../../../Style/Managers.jsx/Managers.css"
import axios from "axios";
import Loader from "../Loader/Loader";
import deleteIcon from "../../../Assets/deleteButton.svg";
import eye from "../../../Assets/eye.svg";
import {Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
function Managers() {
  const [Data, setData] = useState([])
  const [loading,setLoading] =useState(true)
  const token = JSON.parse(localStorage.getItem("AuthToken"))
  const handelDelete = (id) => {
    axios
      .delete(`https://management.mlmcosmo.com/api/delete-manager/${id}`,{headers:{Authorization:`Bearer ${token}`}})
      .then((response) => {
        toast.success(response.data);
        setData(Data.filter((manager) => manager.id !== id));
      })
      .catch((error) => {
        toast.success(error.response.data.message);
      });
  }
  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/managers",{headers:{Authorization:`Bearer ${token}`}})
      .then((response) => {
        console.log(response.data);
        setData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setLoading(true)
      });
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
            <div className="container Managers-table-container vh-100">
              <div className="row Managers-table-row">
                <div className="col-12 mt-5">
                  <h1 className="Managers-title">المديرين</h1>
                </div>
                <div className="col-12 Managers-table-col  mt-3">
                  <table class="table Managers-table  table-hover">
                    <thead>
                      <tr>
                        <th scope="col">الاجراءات</th>

                        <th scope="col">الفرع</th>
                        <th scope="col">الاسم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Data.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="3" className="text-center">
                              لا يوجد مديرين حاليا
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {Data.map((manager) => (
                            <tr>
                              <td className="actions">
                                <div
                                  onClick={() => {
                                    handelDelete(manager.id);
                                  }}
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.8 }}
                                  className="action-icon delete-icon"
                                >
                                  <img src={deleteIcon} alt="حذف" />
                                </div>
                                <Link
                                  to={`/dashboard/manager-details/${manager.id}`}
                                  className="action-icon view-icon"
                                >
                                  <div className="action-icon">
                                    <img src={eye} alt="" />
                                  </div>
                                </Link>
                              </td>
                              <td>{manager.branch.name}</td>
                              <td>
                                {manager.first_name}
                                {manager.last_name}
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
      <Toaster />
    </>
  );
}
export default Managers;
