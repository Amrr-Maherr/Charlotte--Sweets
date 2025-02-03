import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import "../../../Style/Chefs/Chefs.css"
import see from "../../../Assets/eye.svg"
import del from "../../../Assets/deleteButton.svg"
function Chefs() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = JSON.parse(localStorage.getItem("AuthToken"))
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
            <><Loader/></>
          ) : (
            <>
              <div className="container chef-container">
                <div className="row chef-row">
                  <div className="col-12 mt-5">
                    <button className="add-chef">اضافه</button>
                  </div>
                  <div className="col-12 chef-col mt-5">
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
                                  <img src={del} alt="" />
                                  <img src={see} alt="" />
                                </td>
                                <td className="chef-branch">
                                  {em.branch.name}
                                </td>
                                <td className="chef-phone">{em.phone}</td>
                                <td className="chef-name">
                                  {em.first_name}
                                  {""}
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