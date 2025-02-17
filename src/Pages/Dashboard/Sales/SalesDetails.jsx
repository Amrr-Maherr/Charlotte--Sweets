import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import "../../../Style/ChefsDetails/ChefsDetails.css";
import { motion } from "framer-motion"; // Import motion

function SalesDetails() {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    axios
      .get(`https://management.mlmcosmo.com/api/sale/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [id, token]);

  if (loading) return <Loader />;

  // Calculate the number of pages
  const totalPages = Data?.orders
    ? Math.ceil(Data.orders.length / ordersPerPage)
    : 1;

  // Extract orders for the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Data?.orders
    ? Data.orders.slice(indexOfFirstOrder, indexOfLastOrder)
    : [];

  // Pagination navigation
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <section className="chef-details">
      <div className="container chef-details__container">
        <div className="row chef-details__row">
          <div className="col-12 chef-details__col mt-5"></div>
          <div className="col-12 chef-details__col mt-3 d-flex justify-content-center">
            <motion.div // Add motion.div here
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="card text-center shadow" // Modified class
            >
              <div className="card-title py-3 text-start p-4">
                <h3>Sales Details</h3>
              </div>

              {Data?.image && (
                <img
                  src={Data.image}
                  className="card-img-top"
                  alt="Delivery Person"
                  style={{
                    width: "81px",
                    height: "81px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    margin: "0px auto",
                  }}
                />
              )}

              <div className="card-body ">
                <div className="table-responsive">
                  <table className="table table-bordered text-end">
                    <tbody className="text-start">
                      <tr>
                        <th>Name</th>
                        <td>
                          {Data?.first_name
                            ? `${Data.first_name} ${Data.last_name}`
                            : "Not Available"}
                        </td>
                      </tr>
                      <tr>
                        <th>Order Count</th>
                        <td>{Data?.orders ? Data.orders.length : 0}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{Data?.email ? Data.email : "Not Available"}</td>
                      </tr>
                      <tr>
                        <th>Phone Number</th>
                        <td>{Data?.phone ? Data.phone : "Not Available"}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>{Data?.status || "Not Available"}</td>
                      </tr>
                      <tr>
                        <th>Verification Date</th>
                        <td>{Data?.verified_at || "Not Available"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-12 my-4">
            <h3 className="mt-4 text-center ">Order List</h3>
            {Data?.orders && Data.orders.length > 0 ? (
              <>
                <div className="table-responsive my-4 chef-info-table">
                  <table className="table text-center table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Order Type</th>
                        <th>Order Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{indexOfFirstOrder + index + 1}</td>
                          <td>{order.order_type || "No Type"}</td>
                          <td>{order.delivery_date || "No Date"}</td>
                          <td>{order.status || "No Status"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Buttons */}
                <div className="d-flex justify-content-center">
                  <button
                    style={{
                      backgroundColor: "rgba(169, 65, 29, 1)",
                      color: "white",
                    }}
                    className="btn mx-2"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="align-self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    style={{
                      backgroundColor: "rgba(169, 65, 29, 1)",
                      color: "white",
                    }}
                    className="btn mx-2"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted">No orders.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SalesDetails;
