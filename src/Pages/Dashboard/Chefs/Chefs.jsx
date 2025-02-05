import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import "../../../Style/Chefs/Chefs.css"
import see from "../../../Assets/eye.svg"
import del from "../../../Assets/deleteButton.svg"
import { Link } from "react-router-dom";
function Chefs() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"))
  const handelDelete=(id) => {
    axios
      .delete(`https://management.mlmcosmo.com/api/delete-chef/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }
    useEffect(() => {
        axios
          .get("https://management.mlmcosmo.com/api/chefs",{headers:{Authorization:`Bearer ${token}`}})
          .then((response) => {
              setData(response.data);
              setLoading(false)
          })
          .catch((error) => {
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
              <div className="container chef-container">
                <div className="row chef-row">
                  <div className="col-12 mt-5">
                    <h1 className="chef-title">الشيفات</h1>
                  </div>
                  <div className="col-12 chef-col mt-3">
                    <table class="table chef-table table-hover">
                      <thead>
                        <tr>
                          <th scope="col">الاجرائات</th>
                          <th scope="col">الفرع</th>
                          <th scope="col">الجوال</th>
                          <th scope="col">الاسم</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length === 0 ? (
                          <>
                            <td colSpan="4" className="chef-no-data">
                              لا يوجد شيفات متاحة
                            </td>
                          </>
                        ) : (
                          <>
                            {data.map((em) => (
                              <tr>
                                <td className="actions">
                                  <div className="delete-icon">
                                    <img
                                      src={del}
                                      alt=""
                                      onClick={() => {
                                        handelDelete(em.id);
                                      }}
                                    />
                                  </div>
                                  <Link to={`/dashboard/chef-details/${em.id}`}>
                                    <div className="seeIcon">
                                      <img src={see} alt="" />
                                    </div>
                                  </Link>
                                </td>
                                <td className="chef-branch">
                                  {em.branch.name}
                                </td>
                                <td className="chef-phone">{em.phone}</td>
                                <td className="chef-name">
                                  {em.first_name}
                                  {em.last_name}
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
      </>
    );
}
export default Chefs;