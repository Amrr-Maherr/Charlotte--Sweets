import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Loader from "../Loader/Loader";
import "../../../Style/Chefs/Chefs.css";
import see from "../../../Assets/eye.svg";
import del from "../../../Assets/deleteButton.svg";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // Import motion

function Chefs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

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
          .delete(`https://management.mlmcosmo.com/api/delete-chef/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "Deleted!",
              response.data, // Display success message from the API
              "success"
            );
            setData((prevData) => prevData.filter((chef) => chef.id !== id)); // Update the state after deletion
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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/chefs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter chef data based on the search term
  const filteredChefs = data.filter((chef) => {
    const fullName = `${chef.first_name} ${chef.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Calculate the number of pages after filtering
  const totalPagesFiltered = Math.ceil(filteredChefs.length / itemsPerPage);

  // Extract items for the current page after filtering
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredChefs.slice(
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
            {/* Use fragment here */}
            <div
              className="container chef-container"
              style={{ direction: "rtl" }}
            >
              <div className="row chef-row">
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-start"
                    placeholder="Search by chef name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-8 mt-5">
                  <h1 className="chef-title text-start">Chefs</h1>
                </div>
              </div>
              <div className="row chef-row">
                <div className="col-12 chef-col mt-5">
                  <table className="table chef-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">Actions</th>
                        <th scope="col">Order Count</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsFiltered.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="4" className="chef-no-data">
                              No chefs available
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {/* And use fragment here */}
                          {currentItemsFiltered.map((chef, index) => (
                            <motion.tr // Use motion.tr here
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 25,
                                delay: 0.1 * index,
                              }} // Bounce animation with delay based on row order
                              key={chef.id}
                            >
                              <td className="actions">
                                <div
                                  className="delete-icon"
                                  onClick={() => handleDelete(chef.id)}
                                >
                                  <img src={del} alt="Delete" />
                                </div>
                                <Link to={`/dashboard/chef-details/${chef.id}`}>
                                  <div className="seeIcon">
                                    <img src={see} alt="View" />
                                  </div>
                                </Link>
                              </td>
                              <td className="chef-phone">
                                {chef.orders_count}
                              </td>
                              <td className="chef-branch">
                                {chef.branch.name}
                              </td>
                              <td className="chef-name">
                                {chef.first_name} {chef.last_name}
                              </td>
                            </motion.tr>
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
    </>
  );
}

export default Chefs;
