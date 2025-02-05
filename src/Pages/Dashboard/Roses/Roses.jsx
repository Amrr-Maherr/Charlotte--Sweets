import axios from "axios";
import { useEffect, useState } from "react";
import deleteButton from "../../../Assets/deleteButton.svg";
import Loader from "../Loader/Loader"
import "../../../Style/Roses/Roses.css"
import AddButton from "../../../Components/AddButton/AddButton";
function Roses() {
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/flowers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setLoading(false);
      });
  }, [token]);
  const handelDelete = (id) => {
    axios
      .delete(`https://management.mlmcosmo.com/api/flower/${id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
}
  return (
    <section>
      <div className="container Roses-container">
        {loading ? (
          <><Loader/></>
        ) : (
          <>
            <div className="row">
              <div className="col-12 mt-5 Roses-col  d-flex align-items-center justify-content-between">
                <AddButton ButtonText="اضافه"/>
                <h1 className="Roses-title">الورود</h1>
              </div>
              <div className="col-12 mt-5 Roses-table-col">
                <table className="table table-hover text-center Roses-table">
                  <thead>
                    <tr>
                      <th scope="col">الاجراءات</th>
                      <th scope="col">الفرع</th>
                      <th scope="col">النوع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Data.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="no-data-message">
                          لا توجد بيانات لعرضها
                        </td>
                      </tr>
                    ) : (
                      Data.map((ele) => (
                        <tr key={ele.id}>
                          <td className="actions">
                            <div
                              className="delete-icon"
                              onClick={() => {
                                handelDelete(ele.id);
                              }}
                            >
                              <img
                                src={deleteButton}
                                alt="حذف"
                                className="roses-delete-icon"
                              />
                            </div>
                          </td>
                          <td>{ele.branch}</td>
                          <td>{ele.type}</td>
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

export default Roses;
