import React, { useEffect, useState, useCallback } from "react";
import "../../../Style/Branches/Branches.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import deleteIcon from "../../../Assets/deleteButton.svg";
import eye from "../../../Assets/eye.svg";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import AddButton from "../../../Components/AddButton/AddButton";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2"; // Import SweetAlert2

// Correct the problem of icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function Branches() {
  const [branchesData, setBranchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [long, setLongitude] = useState(null);
  const [lat, setLatitude] = useState(null);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset form fields when closing the modal
    setName("");
    setAddress("");
    setPhone("");
    setLongitude(null);
    setLatitude(null);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/branches",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBranchesData(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter branch data based on the search term
  const filteredBranches = branchesData.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the number of pages after filtering
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

  // Extract items for the current page after filtering
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBranches.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
          .delete(`https://management.mlmcosmo.com/api/branches/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "Deleted!",
              response.data, // Display success message from the API
              "success"
            );
            setBranchesData((prevData) =>
              prevData.filter((branch) => branch.id !== id)
            ); // Update the state after deletion
            fetchData(); // Reload data after deletion
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

  const handleSubmit = async () => {
    try {
      // Check if all required fields are filled
      if (!name || !address || !phone || !long || !lat) {
        toast.error("Please fill in all fields.");
        return;
      }

      const data = {
        name,
        address,
        phone,
        long: String(long), // Convert longitude to string
        lat: String(lat), // Convert latitude to string
      };

      const response = await axios.post(
        "https://management.mlmcosmo.com/api/branches",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Branch added successfully!");
      setBranchesData([...branchesData, response.data]); // Update local state
      handleCloseModal();
      fetchData(); // Reload data after adding
    } catch (error) {
      console.error("Error adding branch:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the branch."
      );
    }
  };
  // Component to handle map clicks
  function MapEvents() {
    const map = useMapEvents({
      click: (e) => {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        toast.success(
          `Location selected: Latitude ${e.latlng.lat}, Longitude ${e.latlng.lng}`
        );
      },
    });
    return null;
  }

  return (
    <>
      <div className="branches-component">
        <section className="branches-section h-100">
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              <div className="row">
                <div className="col-xl-4 mt-5">
                  <h1 className="branches-title text-start">Branches</h1>
                </div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded"
                    placeholder="Search by branch name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5 text-end">
                  <AddButton
                    ButtonText="Add Branch"
                    onClick={handleShowModal}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-5">
                  <table className="table branches-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">Branch Name</th>
                        <th scope="col">Branch Manager</th>
                        <th scope="col">Address</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="branches-table-body">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            No Branches to be displayed
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((branch, index) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 25,
                              delay: 0.1 * index,
                            }} // Bounce animation with delay based on row order
                            key={branch.id}
                            className="branches-table-row"
                          >
                            <td>{branch.name.slice(0, 10)}...</td>
                            <td>{branch.address.slice(0, 10)}...</td>
                            <td>
                              {branch.manager
                                ? `${branch.manager.first_name} ${branch.manager.last_name}`
                                : "No Manager"}
                            </td>
                            <td className="actions">
                              <Link
                                to={`/dashboard/branch-details/${branch.id}`}
                                className="action-icon view-icon"
                              >
                                <motion.div
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.8 }}
                                >
                                  <img src={eye} alt="View Details" />
                                </motion.div>
                              </Link>
                              <motion.div
                                onClick={() => {
                                  handleDelete(branch.id);
                                }}
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.8 }}
                                className="action-icon delete-icon"
                              >
                                <img src={deleteIcon} alt="Delete" />
                              </motion.div>
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
                <span className="align-self-center">
                  Page {currentPage} of {totalPages}
                </span>
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
              </div>
            </div>
          )}
        </section>
        <Toaster />
      </div>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered d-flex justify-content-center">
          <div className="modal-content" style={{ width: "462px" }}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Branch
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body text-end">
              <div className="map-container mb-3">
                <div className="map" style={{ height: "300px", width: "100%" }}>
                  {/* Leaflet Map */}
                  <MapContainer
                    center={[24.4539, 54.3773]}
                    zoom={10}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapEvents />
                    {lat !== null && long !== null && (
                      <Marker position={[lat, long]}></Marker>
                    )}
                  </MapContainer>
                </div>
                {lat && long && (
                  <div className="mt-2">
                    <p>Latitude: {lat}</p>
                    <p>Longitude: {long}</p>
                  </div>
                )}
              </div>
              <div className="form-container">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    placeholder="Enter branch name..."
                    type="text"
                    id="name"
                    className="form-control text-end"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required // Make the field required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    placeholder="Enter branch address..."
                    type="text"
                    id="address"
                    className="form-control text-end"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required // Make the field required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    placeholder="Enter branch phone number..."
                    type="text"
                    id="phone"
                    className="form-control text-end"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required // Make the field required
                  />
                </div>
                <div className="d-flex justify-content-center  w-50 mx-auto">
                  <button
                    style={{
                      width: "230px",
                      height: "40px",
                      border: "none",
                      backgroundColor: "#A9411D",
                      borderRadius: "10px",
                      color: "#FFFBFB",
                      // eslint-disable-next-line no-dupe-keys
                      borderRadius: "10px",
                    }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Branches;
