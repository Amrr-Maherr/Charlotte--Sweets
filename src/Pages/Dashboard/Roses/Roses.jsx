import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import deleteButton from "../../../Assets/deleteButton.svg";
import Loader from "../Loader/Loader";
import "../../../Style/Roses/Roses.css";
import AddButton from "../../../Components/AddButton/AddButton";
import { Modal } from "bootstrap";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function Roses() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([]); // State for branch list
  const [RoseBranch, setRoseBranch] = useState("");
  const [RoseTitle, setRoseTitle] = useState("");
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this value

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
    fetchBranches(); // Fetch branch list on component mount
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/flowers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/branches",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBranches(response.data);
    } catch (error) {
      console.log("Error fetching branches:", error);
    }
  };

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
          .delete(`https://management.mlmcosmo.com/api/flower/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "Deleted!",
              "Rose deleted successfully.", // Success message
              "success"
            );
            fetchData(); // Refresh data after deletion
          })
          .catch((error) => {
            console.log(error.response.data);
            toast.error("Failed to delete rose."); // Show error message
          });
      }
    });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handelAdd = async () => {
    if (!RoseTitle || !RoseBranch) {
      toast.error("Please fill in all fields."); // Use toast to display error message
    } else {
      try {
        const formData = {
          type: RoseTitle,
          branch_id: RoseBranch,
        };
        const response = await axios.post(
          "https://management.mlmcosmo.com/api/store-flower",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        toast.success("Rose added successfully."); // Use toast to display success message
        fetchData(); // Refresh data after addition
        handleCloseModal(); // Close the Modal after addition
      } catch (error) {
        toast.error(error.response.data.message); // Use toast to display error message
      }
    }
  };

  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById("addRoseModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();

        return () => {
          modal.hide();
        };
      }
    }
  }, [showModal]);

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination functions
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Toaster />
      <section>
        <div className="container Roses-container">
          {loading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <div className="row my-3">
                <div className="col-xl-4 mt-5">
                  <AddButton ButtonText="Add" onClick={handleShowModal} />
                </div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="Search by type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h1
                    className="Roses-title text-end"
                    style={{ fontSize: "20px" }}
                  >
                    Roses
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-5 Roses-table-col">
                  <table className="table table-hover text-center Roses-table shadow">
                    <thead>
                      <tr>
                        <th scope="col">Actions</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="no-data-message">
                            No data to display
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((ele, index) => (
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
                          >
                            <td className="actions">
                              <div
                                className="delete-icon"
                                onClick={() => {
                                  handelDelete(ele.id);
                                }}
                              >
                                <img
                                  src={deleteButton}
                                  alt="Delete"
                                  className="roses-delete-icon"
                                />
                              </div>
                            </td>
                            <td>{ele.branch.name}</td>
                            <td>{ele.type}</td>
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
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn mx-2"
                  style={{
                    backgroundColor: "rgba(169, 65, 29, 1)",
                    color: "white",
                  }}
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        <div
          className={`modal fade`}
          id="addRoseModal"
          tabIndex="-1"
          aria-labelledby="addRoseModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addRoseModalLabel">
                  Add New Rose
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Form */}
                <form>
                  <div className="mb-3">
                    <label
                      htmlFor="branchName"
                      className="form-label w-100 text-end"
                    >
                      Branch Name
                    </label>
                    <select
                      className="form-select"
                      id="branchName"
                      onChange={(event) => {
                        setRoseBranch(event.target.value);
                      }}
                    >
                      <option value="">Choose Branch</option>
                      {branches.map((branch) => (
                        <option
                          className="text-end"
                          key={branch.id}
                          value={branch.id}
                        >
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="roseType"
                      className="form-label w-100 text-end"
                    >
                      Rose Type
                    </label>
                    <input
                      onChange={(event) => {
                        setRoseTitle(event.target.value);
                      }}
                      type="text"
                      className="form-control text-end"
                      id="roseType"
                      placeholder="Enter rose type"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleCloseModal}
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
                  onClick={() => {
                    handelAdd();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Roses;
