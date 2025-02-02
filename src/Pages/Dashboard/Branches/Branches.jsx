import React, { useEffect, useState } from "react";
import "../../../Style/Branches/Branches.css"; // Import the CSS file
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import deleteIcon from "../../../Assets/deleteButton.svg"
import eye from "../../../Assets/eye.svg"
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
function Branches() {
  const [branchesData, setBranchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/branches",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBranchesData(response.data);
        setTimeout(() => {
          setLoading(false);
        },2000)
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);
  const handleDelete = (id) => {
    axios
      .delete(`https://management.mlmcosmo.com/api/branches/${id}`)
      .then((response) => {
        toast.success(response.data);
        setBranchesData(branchesData.filter((branch)=>(branch.id !== id)))
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <>
      <div className="branches-component">
        <section className="branches-section vh-100">
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              <div className="row">
                <div className="col-12 mt-5">
                  <motion.button
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.7 }}
                    className="add-manager-button"
                  >
                    اضافه
                  </motion.button>
                </div>
                <div className="col-12 mt-5">
                  <table className="table branches-table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">الاجراءات</th>
                        <th scope="col">مدير الفرع</th>
                        <th scope="col">العنوان</th>
                        <th scope="col">اسم الفرع</th>
                      </tr>
                    </thead>
                    <tbody className="branches-table-body">
                      {branchesData.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            No Branches to be displayed
                          </td>
                        </tr>
                      ) : (
                        branchesData.map((branch) => (
                          <tr key={branch.id} className="branches-table-row">
                            <td className="actions">
                              <motion.div
                                onClick={() => {
                                  handleDelete(branch.id);
                                }}
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.8 }}
                                className="action-icon delete-icon"
                              >
                                <img src={deleteIcon} alt="حذف" />
                              </motion.div>
                              <Link
                                to={`/dashboard/branch-details/${branch.id}`}
                                className="action-icon view-icon"
                              >
                                <motion.div
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.8 }}
                                >
                                  <img src={eye} alt="عرض التفاصيل" />
                                </motion.div>
                              </Link>
                            </td>
                            <td>
                              {branch.manager.first_name}{" "}
                              {branch.manager.last_name}
                            </td>
                            <td>{branch.address.slice(0, 10)}...</td>
                            <td>{branch.name.slice(0, 10)}...</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
        <Toaster />
      </div>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered d-flex justify-content-center">
          <div className="modal-content" style={{ width: "462px" }}>
            <div className="modal-body text-end">
              <div className="map-container mb-3">
                <div className="map">
                  <h1>map</h1>
                </div>
              </div>
              <div className="form-container">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    الاسم
                  </label>
                  <input type="text" id="name" className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    العنوان
                  </label>
                  <input type="text" id="address" className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    رقم الجوال
                  </label>
                  <input type="text" id="phone" className="form-control" />
                </div>
                <div className="d-flex justify-content-center  w-50 mx-auto">
                  <button
                    style={{
                      width: "230px",
                      height: "40px",
                      border: "none",
                      backgroundColor: "#A9411D",
                      borderRadius: "10px",
                    }}
                  >
                    ارسال{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Branches;
