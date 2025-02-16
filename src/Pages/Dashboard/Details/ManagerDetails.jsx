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
                    <div className="card-title text-start">
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
                        <tbody className="text-start">
                          <tr>
                            <th>Name</th>
                            <td>
                              {Manager.first_name
                                ? `${Manager.first_name} ${Manager.last_name}`
                                : "Not Available"}
                            </td>
                          </tr>
                          <tr>
                            <th>Branch</th>
                            <td>
                              {Manager.branch
                                ? Manager.branch.name
                                : "No Branch"}
                            </td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>{Manager.email || "Not Available"}</td>
                          </tr>
                          <tr>
                            <th>Phone Number</th>
                            <td>{Manager.phone || "Not Available"}</td>
                          </tr>
                          <tr>
                            <th>Status</th>
                            <td>{Manager.status || "Not Available"}</td>
                          </tr>
                          <tr>
                            <th>Added Date</th>
                            <td>{Manager.verified_at || "Not Available"}</td>
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
