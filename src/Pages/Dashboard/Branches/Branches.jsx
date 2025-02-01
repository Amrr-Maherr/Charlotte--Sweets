import React, { useEffect, useState } from "react";
import "../../../Style/Branches/Branches.css"; // Import the CSS file
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import deleteIcon from "../../../Assets/deleteButton.svg"
import seeIcon from "../../../Assets/seeButton.svg"
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
        console.log(response.data);
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
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="branches-component">
      <section className="branches-section">
        {loading ? (
          <Loader />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-12 mt-5">
                <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.7}} className="add-manager-button">اضافه</motion.button>
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
                                <img src={seeIcon} alt="عرض التفاصيل" />
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
  );
}

export default Branches;
