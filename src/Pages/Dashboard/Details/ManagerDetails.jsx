import { useEffect, useState } from "react";
import "../../../Style/Details/Details.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion"; // Import motion

function Details() {
  const [Manager, setManager] = useState({});
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://management.mlmcosmo.com/api/manager/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setManager(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [token, id]);

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <motion.div // Add motion.div here
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="container Details-container">
              <div className="row Details-row">
                <div className="col-12 Details-col">
                  <div className="card text-center">
                    <div className="card-title">
                      <h3>Manager Details</h3>
                    </div>
                    {Manager.image && (
                      <img
                        src={Manager.image}
                        className="card-img-top"
                        alt="Manager"
                        style={{
                          width: "81px",
                          height: "81px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          margin: "0px auto",
                        }}
                      />
                    )}
                    <div className="card-body">
                      <table className="table table-bordered text-end">
                        <tbody>
                          <tr>
                            <td>
                              {Manager.first_name
                                ? `${Manager.first_name} ${Manager.last_name}`
                                : "Not Available"}
                            </td>
                            <th>Name</th>
                          </tr>
                          <tr>
                            <td>
                              {Manager.branch
                                ? Manager.branch.name
                                : "No Branch"}
                            </td>
                            <th>Branch</th>
                          </tr>
                          <tr>
                            <td>{Manager.email || "Not Available"}</td>
                            <th>Email</th>
                          </tr>
                          <tr>
                            <td>{Manager.phone || "Not Available"}</td>
                            <th>Phone Number</th>
                          </tr>
                          <tr>
                            <td>{Manager.status || "Not Available"}</td>
                            <th>Status</th>
                          </tr>
                          <tr>
                            <td>{Manager.verified_at || "Not Available"}</td>
                            <th>Added Date</th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> // Closing motion.div here
        )}
      </section>
    </>
  );
}

export default Details;
