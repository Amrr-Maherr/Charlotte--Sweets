import React, { useEffect, useState, useCallback } from "react";
import "../../../Style/Managers.jsx/Managers.css";
import axios from "axios";
import Loader from "../Loader/Loader";
import deleteIcon from "../../../Assets/deleteButton.svg";
import eye from "../../../Assets/eye.svg";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Swal from "sweetalert2"; // Import SweetAlert2
import { motion } from "framer-motion"; // Import motion

function Managers() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/managers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Calculate total number of pages
  const totalPages = Math.ceil(Data.length / itemsPerPage);

  // Extract items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination navigation
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
          .delete(`https://management.mlmcosmo.com/api/delete-manager/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "Deleted!",
              response.data, // Display success message from the API
              "success"
            );
            setData((prevData) =>
              prevData.filter((manager) => manager.id !== id)
            ); // Update the state after deletion
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              error.response?.data?.message ||
                "An error occurred during deletion.", // Display error message from the API or a general message
              "error"
            );
          });
      }
    });
  };

  // Filter manager data based on the search term
  const filteredManagers = Data.filter((manager) => {
    const fullName = `${manager.first_name} ${manager.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Calculate the number of pages after filtering
  const totalPagesFiltered = Math.ceil(filteredManagers.length / itemsPerPage);

  // Extract items for the current page after filtering
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredManagers.slice(
    indexOfFirstItemFiltered,
    indexOfLastItemFiltered
  );

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Managers-table-container vh-100">
              <div className="row Managers-table-row">
                <div className="col-xl-4 mt-5"></div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="Search by manager name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h1 className="Managers-title text-end">Managers</h1>
                </div>
              </div>
              <div className="row Managers-table-row">
                <div className="col-12 Managers-table-col mt-5">
                  <table className="table Managers-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">Actions</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsFiltered.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="3" className="text-center">
                              No managers available
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {currentItemsFiltered.map((manager, index) => (
                            <motion.tr // Use motion.tr here
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 25,
                                delay: 0.1 * index,
                              }} // Bounce animation with delay based on row order
                              key={manager.id}
                            >
                              <td className="actions">
                                <motion.div
                                  onClick={() => {
                                    handleDelete(manager.id);
                                  }}
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.8 }}
                                  className="action-icon delete-icon"
                                >
                                  <img src={deleteIcon} alt="Delete" />
                                </motion.div>
                                <Link
                                  to={`/dashboard/manager-details/${manager.id}`}
                                  className="action-icon view-icon"
                                >
                                  <div className="action-icon">
                                    <img src={eye} alt="View" />
                                  </div>
                                </Link>
                              </td>
                              <td>{manager.branch.name}</td>
                              <td>
                                {manager.first_name} {manager.last_name}
                              </td>
                            </motion.tr> // Closing motion.tr here
                          ))}
                        </>
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
      <Toaster />
    </>
  );
}
export default Managers;
