import React, { useEffect, useState, useCallback } from "react";
import "../../../Style/Sales/Sales.css";
import axios from "axios";
import { Link } from "react-router-dom";
import eye from "../../../Assets/eye.svg";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import DeleteIcon from "../../../Assets/deleteButton.svg";
import Swal from "sweetalert2";

function Sales() {
  const [Data, seData] = useState([]);
  const [loading, setloading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/sales",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        seData(response.data);
        setloading(false);
      } catch (error) {
        setloading(true);
      }
    };

    fetchData();
  }, [token]);

  // Delete function
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      // Use async/await
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `https://management.mlmcosmo.com/api/delete-sale/${id}`, // Endpoint edited
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire("Deleted!", response.data, "success");
          seData((prevData) => prevData.filter((sale) => sale.id !== id));
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message ||
              "An error occurred during deletion.",
            "error"
          );
        }
      }
    });
  };

  // Filter sales data based on the search term
  const filteredSales = Data.filter((sale) => {
    const fullName = `${sale.first_name} ${sale.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Calculate the number of pages after filtering
  const totalPagesFiltered = Math.ceil(filteredSales.length / itemsPerPage);

  // Extract items for the current page after filtering
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredSales.slice(
    indexOfFirstItemFiltered,
    indexOfLastItemFiltered
  );

  // Pagination navigation
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPagesFiltered));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Sales-table-container">
              <div className="row">
                <div className="col-xl-4 mt-5"></div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="Search by sales representative name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h2 className="Sales-table-title text-end">Sales List</h2>
                </div>
              </div>
              <div className="row Sales-table-row">
                <div className="col-12 Sales-table-col mt-5">
                  <table className="table Sales-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">Actions</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsFiltered.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No sales currently available
                          </td>
                        </tr>
                      ) : (
                        currentItemsFiltered.map((sale, index) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 25,
                              delay: 0.1 * index,
                            }}
                            key={sale.id}
                          >
                            <td className="actions">
                              <div
                                className="action-icon delete-icon"
                                onClick={() => handleDelete(sale.id)}
                              >
                                <img src={DeleteIcon} alt="Delete" />
                              </div>
                              <Link
                                to={`/dashboard/sales-details/${sale.id}`}
                                className="action-icon view-icon"
                              >
                                <div className="action-icon">
                                  <img src={eye} alt="" />
                                </div>
                              </Link>
                            </td>
                            <td>{sale.email}</td>
                            <td>{sale.phone}</td>
                            <td>
                              {sale.first_name} {sale.last_name}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
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
                  Page {currentPage} of {totalPagesFiltered}
                </span>
                <button
                  className="btn mx-2"
                  style={{
                    backgroundColor: "rgba(169, 65, 29, 1)",
                    color: "white",
                  }}
                  onClick={nextPage}
                  disabled={currentPage === totalPagesFiltered}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Sales;
