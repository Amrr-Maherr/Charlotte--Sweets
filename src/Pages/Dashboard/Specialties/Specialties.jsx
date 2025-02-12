import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import "../../../Style/Specialties/Specialties.css";
import Loader from "../Loader/Loader";
import deleteIcon from "../../../Assets/deleteButton.svg";
import AddButton from "../../../Components/AddButton/AddButton";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function Specialties() {
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [newSpecialty, setNewSpecialty] = useState(""); // State for the new specialty name

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/specializations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setData(response.data);
      setLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      setLoading(false); // Stop loading in case of error
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [token, fetchData]);

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

  const handelDelete = (id) => {
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
          .delete(`https://management.mlmcosmo.com/api/specialization/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire("Deleted!", response.data, "success");
            setData((prevData) => prevData.filter((spec) => spec.id !== id)); // Update the state after deletion
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              error.response?.data?.message || "An error occurred",
              "error"
            );
          });
      }
    });
  };

  // Filter specialties data based on the search term
  const filteredSpecialties = Data.filter((specialty) => {
    const specialtyName = specialty.name || "";
    return specialtyName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate the number of pages after filtering
  const totalPagesFiltered = Math.ceil(
    filteredSpecialties.length / itemsPerPage
  );

  // Extract items for the current page after filtering
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredSpecialties.slice(
    indexOfFirstItemFiltered,
    indexOfLastItemFiltered
  );

  // Handel Submit Form
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://management.mlmcosmo.com/api/specialization",
        { name: newSpecialty }, // key is name
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Specialty added successfully");
      setData((prevData) => [...prevData, response.data]); // Update the state after adding
      fetchData(); // Update the list of specialties after successful submission
      setNewSpecialty(""); // Clear input field
      // Close the modal after successful submission
      const modal = document.getElementById("addSpecialtyModal");
      if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
        document.body.style.paddingRight = "";
        document.querySelector(".modal-backdrop")?.remove();
      }
    } catch (error) {
      console.error("Error adding specialty:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the specialty."
      );
    }
  };
  return (
    <section className="specialties-section">
      <Toaster />
      <div className="container">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="row">
              <div className="col-xl-4 mt-5">
                <AddButton
                  ButtonText="Add"
                  data-bs-toggle="modal"
                  data-bs-target="#addSpecialtyModal" // Modal ID here
                />
              </div>
              <div className="col-xl-4 mt-5">
                <input
                  type="text"
                  className="form-control p-2 rounded text-end"
                  placeholder="Search by specialty name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-xl-4 mt-5">
                <h3 className="section-title text-end">Specialties</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-5">
                <table className="table specialties-table table-hover text-center shadow">
                  <thead>
                    <tr>
                      <th scope="col" className="table-header">
                        Actions
                      </th>
                      <th scope="col" className="table-header">
                        Specialty
                      </th>
                      <th scope="col" className="table-header">
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItemsFiltered.length === 0 ? (
                      <tr className="no-data-row">
                        <td colSpan="3" className="no-data-message">
                          No data to display
                        </td>
                      </tr>
                    ) : (
                      currentItemsFiltered.map((ele, index) => (
                        <motion.tr // Use motion.tr here
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 25,
                            delay: 0.1 * index,
                          }}
                          key={ele.id}
                          className="specialty-row"
                        >
                          <td className="actions-cell">
                            <div
                              className="deleteIcon"
                              onClick={() => {
                                handelDelete(ele.id);
                              }}
                            >
                              <img src={deleteIcon} alt="Delete" />
                            </div>
                          </td>
                          <td className="specialty-name">{ele.name}</td>
                          <td className="specialty-id">
                            {indexOfFirstItem + index + 1}
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
          </>
        )}
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="addSpecialtyModal"
        tabIndex="-1"
        aria-labelledby="addSpecialtyModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addSpecialtyModalLabel">
                Add New Specialty
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Form for adding a new specialty */}
              <div className="mb-3">
                <label
                  htmlFor="specialtyName"
                  className="form-label text-end w-100"
                >
                  Specialty Name
                </label>
                <input
                  type="text"
                  className="form-control text-end"
                  id="specialtyName"
                  placeholder="Enter specialty name"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                style={{
                  backgroundColor: "rgba(169, 65, 29, 1)",
                  color: "white",
                }}
                type="button"
                className="btn"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Specialties;
