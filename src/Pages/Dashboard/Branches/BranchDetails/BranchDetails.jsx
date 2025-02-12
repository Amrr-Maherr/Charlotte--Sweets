import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../Loader/Loader";
import { motion } from "framer-motion";
import "../../../../Style/BranchDetails/BranchDetails.css";

function BranchDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://management.mlmcosmo.com/api/branches/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching branch details:", error);
        console.log("Error Response Data:", error.response?.data);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <p>No data found for branch with ID: {id}</p>;
  }

  return (
    <section className="branch-details-section py-5">
      <div className="container">
        <div className="row">
          {/* Map Display */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-md-6 mb-4"
          >
            <h3 className="card-title mb-3 text-start">Map</h3>
            <div className="card shadow-lg">
              <div className="card-body map-card">
                <iframe
                  src={`https://www.google.com/maps?q=${data.lat},${data.long}&hl=en&z=13&output=embed`}
                  width="100%"
                  height="400px"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              </div>
            </div>
          </motion.div>

          {/* Branch Details */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-md-6 mb-4"
          >
            <h3 className="card-title mb-3 text-start">Branch Details</h3>
            <div className="card shadow-lg branch-card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-end w-100 text-start mt-3">
                  <div className="branch-labels me-auto">
                    <p className="label">Branch Name</p>
                    <p className="label">Address</p>
                    <p className="label">Branch Manager</p>
                    <p className="label">Phone Number</p>
                  </div>
                  <div className="branch-info">
                    <p className="branch-name" style={{ width: "400px" }}>
                      {data.name}
                    </p>
                    <p className="branch-address" style={{ width: "400px" }}>
                      {data.address}
                    </p>
                    {data.manager ? (
                      <p className="branch-manager" style={{ width: "400px" }}>
                        {data.manager.first_name} {data.manager.last_name}
                      </p>
                    ) : (
                      <p className="branch-manager" style={{ width: "400px" }}>
                        No Manager
                      </p>
                    )}
                    <p className="branch-phone" style={{ width: "400px" }}>
                      {data.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chefs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-12 chefs-list my-5"
          >
            <div className="chefs-container">
              <div className="chefs-grid container">
                <h3 className="chefs-title text-start">Chefs</h3>
                <div className="row gy-4">
                  {data.chefs && data.chefs.length > 0 ? (
                    data.chefs.map((chef, index) => (
                      <div
                        key={index}
                        className="col-xl-3 col-md-6 col-12 chef-col"
                      >
                        <div className="card chef-card shadow">
                          <div className="chef-image">
                            <img src={chef.image} alt="" />
                          </div>
                          <div className="chef-info">
                            <p className="chef-name text-start">
                              {chef.first_name} {chef.last_name}
                            </p>
                            <p className="chef-bio text-start">{chef.bio}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-start">No chefs for this branch.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sales Representatives */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-12 sales"
          >
            <div className="container">
              <div className="row gy-4">
                <h3 className="delivery-title text-start">
                  Sales Representatives
                </h3>
                {data.deliveries && data.deliveries.length > 0 ? (
                  data.deliveries.map((delivery, index) => (
                    <div
                      key={index}
                      className="col-xl-3 col-md-6 col-12 delivery-col"
                    >
                      <div className="card delivery-card shadow">
                        <div className="delivery-image">
                          <img src={delivery.image} alt={delivery.first_name} />
                        </div>
                        <div className="delivery-info">
                          <p className="delivery-name">
                            {delivery.first_name} {delivery.last_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-start">
                    No sales representatives for this branch.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BranchDetails;
