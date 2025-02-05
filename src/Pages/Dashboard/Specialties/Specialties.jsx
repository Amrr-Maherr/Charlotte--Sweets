import axios from "axios";
import { useEffect, useState } from "react";
import "../../../Style/Specialties/Specialties.css"
import Loader from "../Loader/Loader"
import deleteIcon from "../../../Assets/deleteButton.svg";
function Specialties() {
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/specializations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false); // بعد تحميل البيانات أوقف التحميل
      })
      .catch((error) => {
        console.log(error.response?.data?.message || error.message);
        setLoading(false); // في حال حدوث خطأ، نوقف التحميل
      });
  }, [token]);
  const handelDelete = (id) => {
    axios
      .delete(`https://test.ashlhal.com/api/specializations/${id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }
  return (
    <section className="specialties-section">
      <div className="container">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="row">
              <div className="col-12 mt-5">
                <h3 className="section-title">التخصصات</h3>
              </div>
              <div className="col-12 mt-3">
                <table className="table specialties-table table-hover text-center">
                  <thead>
                    <tr>
                      <th scope="col" className="table-header">
                        الاجراءات
                      </th>
                      <th scope="col" className="table-header">
                        التخصص
                      </th>
                      <th scope="col" className="table-header">
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Data.length === 0 ? (
                      <tr className="no-data-row">
                        <td colSpan="3" className="no-data-message">
                          لا توجد بيانات لعرضها
                        </td>
                      </tr>
                    ) : (
                      Data.map((ele) => (
                        <tr key={ele.id} className="specialty-row">
                          <td className="actions-cell">
                            <div className="deleteIcon" onClick={()=>{handelDelete(ele.id)}}>
                              <img src={deleteIcon} alt="" />
                            </div>
                          </td>
                          <td className="specialty-name">{ele.name}</td>
                          <td className="specialty-id">{ele.id}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Specialties;
