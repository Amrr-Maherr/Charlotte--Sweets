import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../Pages/Dashboard/Loader/Loader";
import "../../../Style/Details/Details.css"; // Import CSS
import { motion } from "framer-motion"; // Import motion

function SalesRepresentativesDetails() {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://management.mlmcosmo.com/api/delivery/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response?.data);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section>
      <div className="container Details-container">
        <div className="row Details-row">
          <div className="col-12 Details-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="card text-end shadow"
            >
              <div className="card-title text-start">
                <h3>Delivery Representative Details</h3>
              </div>
              {Data.image && (
                <img
                  src={Data.image}
                  className="card-img-top"
                  alt="Delivery Representative"
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
                <div className="table-responsive">
                  <table className="table table-bordered text-start">
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td>
                          {Data.first_name
                            ? `${Data.first_name} ${Data.last_name}`
                            : "Not Available"}
                        </td>
                      </tr>
                      <tr>
                        <th>Branch</th>
                        <td>{Data.branch ? Data.branch.name : "No Branch"}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{Data.email || "Not Available"}</td>
                      </tr>
                      <tr>
                        <th>Phone Number</th>
                        <td>{Data.phone || "Not Available"}</td>
                      </tr>
                      <tr>
                        <th>Order Status</th>
                        <td>{Data.status || "Not Available"}</td>
                      </tr>
                      <tr>
                        <th>Added Date</th>
                        <td>{Data.verified_at || "Not Available"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SalesRepresentativesDetails;
