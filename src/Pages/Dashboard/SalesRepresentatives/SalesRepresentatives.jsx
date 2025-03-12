import React, { useEffect, useState, useCallback } from "react";
import "../../../Style/SalesRepresentatives/SalesRepresentatives.css";
import Loader from "../../../Pages/Dashboard/Loader/Loader";
import axios from "axios";
import Delete from "../../../Assets/deleteButton.svg";
import Eye from "../../../Assets/eye.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion
import Swal from "sweetalert2"; // Import SweetAlert2

function SalesRepresentatives() {
  const [Data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/deliveries",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response?.data?.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Calculate the number of pages
  const totalPages = Math.ceil(Data.length / itemsPerPage);

  // Extract items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination navigation
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Delete function with SweetAlert2
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://management.mlmcosmo.com/api/delete-delivery/${id}`, {
            // Endpoint updated here
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "Deleted!",
              "Delivery representative deleted successfully.",
              "success"
            );
            setData((prevData) => prevData.filter((rep) => rep.id !== id)); // Update the state after deletion
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              error.response?.data?.message ||
                "An error occurred during deletion.",
              "error"
            );
          });
      }
    });
  };

  // Filter sales representatives data based on the search term
  const filteredSalesReps = Data.filter((rep) => {
    const fullName = `${rep.first_name} ${rep.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Calculate the number of pages after filtering
  const totalPagesFiltered = Math.ceil(filteredSalesReps.length / itemsPerPage);

  // Extract items for the current page after filtering
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredSalesReps.slice(
    indexOfFirstItemFiltered,
    indexOfLastItemFiltered
  );

  return (
    <section className="sales-representatives-section">
      {Loading ? (
        <Loader />
      ) : (
        <div className="container sales-reps-table-container">
          <div className="row sales-reps-table-row">
            <div className="col-xl-8 mt-5">
              <h1 className="sales-representatives-title text-start">
                Delivery Order List
              </h1>
            </div>
            <div className="col-xl-4 mt-5">
              <input
                type="text"
                className="form-control p-2 rounded text-start"
                placeholder="Search by sales representative name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="row sales-reps-table-row">
            <div className="col-12 sales-reps-table-col mt-5">
              <table className="table sales-reps-table  table-hover shadow">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Order Count</th>
                    <th scope="col">Branch</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsFiltered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No sales representatives available.
                      </td>
                    </tr>
                  ) : (
                    currentItemsFiltered.map((rep, index) => (
                      <motion.tr // Use motion.tr here
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 25,
                          delay: 0.1 * index,
                        }}
                        key={rep.id}
                        className="sales-reps-table-row"
                      >
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          {rep.first_name} {rep.last_name}
                        </td>
                        <td>{rep.orders_count}</td>
                        <td>{rep.branch.name}</td>
                        <td>
                          <div className="actions">
                            <Link
                              to={`/dashboard/sales-representatives-details/${rep.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <img src={Eye} alt="" />
                            </Link>
                            <img
                              src={Delete}
                              alt="Delete"
                              onClick={() => handleDelete(rep.id)} // Connect the delete function here
                            />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
      )}
    </section>
  );
}

export default SalesRepresentatives;
