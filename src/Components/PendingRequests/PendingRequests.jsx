import { Link } from "react-router-dom";
import "../../Style/PendingRequests/PendingRequests.css";
import Delete from "../../Assets/Group 12.png";
import Acc from "../../Assets/Group 13.png";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

function PendingRequests() {
  const [pendingManagers, setPendingManagers] = useState([]);
  const [pendingSales, setPendingSales] = useState([]);
  const [managersKey, setManagersKey] = useState(""); // Store the "key" value for managers
  const [salesKey, setSalesKey] = useState(""); // Store the "key" value for sales
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchPendingData = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch pending managers
        const managersResponse = await axios.get(
          "https://management.mlmcosmo.com/api/pending-managers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (managersResponse.data && managersResponse.data.data) {
          setPendingManagers(managersResponse.data.data.slice(0, 2)); // Get only the first two
          setManagersKey(managersResponse.data.key || "Manager"); // Store the key, default to "Manager"
        }

        // Fetch pending sales
        const salesResponse = await axios.get(
          "https://management.mlmcosmo.com/api/pending-sales",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (salesResponse.data && salesResponse.data.data) {
          setPendingSales(salesResponse.data.data.slice(0, 2)); // Get only the first two
          setSalesKey(salesResponse.data.key || "Sales Representative"); // Store the key, default to "Sales Representative"
        }
      } catch (error) {
        console.error("Error fetching pending data:", error);
      } finally {
        setLoading(false); // End loading regardless of success or failure
      }
    };

    fetchPendingData();
  }, [token]);

  // Function to handle accepting or rejecting a manager
  const handleManagerAction = (id, action) => {
    const endpoint =
      action === "accept"
        ? `https://management.mlmcosmo.com/api/accept-manager/${id}`
        : `https://management.mlmcosmo.com/api/reject-manager/${id}`;

    const confirmationText =
      action === "accept"
        ? "Do you want to accept this manager?"
        : "Do you want to reject this manager?";

    Swal.fire({
      title: "Are you sure?",
      text: confirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            endpoint,
            {}, // Empty data object since it's a POST request
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire(
              `${action === "accept" ? "Accepted" : "Rejected"}!`,
              `The manager has been ${
                action === "accept" ? "accepted" : "rejected"
              }.`,
              "success"
            );
            // Update the state to remove the manager from the list
            setPendingManagers((prevManagers) =>
              prevManagers.filter((manager) => manager.id !== id)
            );
          })
          .catch((error) => {
            console.error(`Error ${action}ing manager:`, error);
            Swal.fire(
              "Error!",
              `There was an error ${action}ing the manager.`,
              "error"
            );
          });
      }
    });
  };

  // Function to handle accepting or rejecting a sale
  const handleSaleAction = (id, action) => {
    const endpoint =
      action === "accept"
        ? `https://management.mlmcosmo.com/api/accept-sale/${id}`
        : `https://management.mlmcosmo.com/api/reject-sale/${id}`;

    const confirmationText =
      action === "accept"
        ? "Do you want to accept this sales representative?"
        : "Do you want to reject this sales representative?";

    Swal.fire({
      title: "Are you sure?",
      text: confirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            endpoint,
            {}, // Empty data object since it's a POST request
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire(
              `${action === "accept" ? "Accepted" : "Rejected"}!`,
              `The sales representative has been ${
                action === "accept" ? "accepted" : "rejected"
              }.`,
              "success"
            );
            // Update the state to remove the sales representative from the list
            setPendingSales((prevSales) =>
              prevSales.filter((sale) => sale.id !== id)
            );
          })
          .catch((error) => {
            console.error(`Error ${action}ing sale:`, error);
            Swal.fire(
              "Error!",
              `There was an error ${action}ing the sales representative.`,
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      <div className="PendingRequests-title">
        <Link to="">View all</Link>
        <p>Addition requests</p>
      </div>
      <div className="PendingRequests-main-parent shadow">
        {loading ? (
          <p>Loading pending requests...</p>
        ) : pendingManagers.length === 0 && pendingSales.length === 0 ? (
          <p>No pending requests at the moment.</p>
        ) : (
          <>
            {/* Display Pending Managers */}
            {pendingManagers.map((manager) => (
              <div className="request-item" key={manager.id}>
                <div className="request-actions">
                  <div
                    className="accept-button"
                    onClick={() => handleManagerAction(manager.id, "accept")}
                  >
                    {/* Add onClick handler */}
                    <img src={Acc} alt="Accept" />
                  </div>
                  <div
                    className="delete-button"
                    onClick={() => handleManagerAction(manager.id, "reject")}
                  >
                    {/* Add onClick handler */}
                    <img src={Delete} alt="Delete" />
                  </div>
                </div>
                <div className="employee-info">
                  <p className="employee-name p-0 m-0">
                    {manager.first_name} {manager.last_name}
                  </p>
                  <p className="employee-title p-0 m-0">{managersKey}</p>
                  {/* Display the "key" value */}
                </div>
                <div className="employee-image">
                  <img
                    src={manager.image || "URL_TO_DEFAULT_IMAGE"}
                    alt="Employee"
                  />
                </div>
              </div>
            ))}

            {/* Display Pending Sales */}
            {pendingSales.map((sale) => (
              <div className="request-item" key={sale.id}>
                <div className="request-actions">
                  <div
                    className="accept-button"
                    onClick={() => handleSaleAction(sale.id, "accept")}
                  >
                    {/* Add onClick handler */}
                    <img src={Acc} alt="Accept" />
                  </div>
                  <div
                    className="delete-button"
                    onClick={() => handleSaleAction(sale.id, "reject")}
                  >
                    {/* Add onClick handler */}
                    <img src={Delete} alt="Delete" />
                  </div>
                </div>
                <div className="employee-info">
                  <p className="employee-name p-0 m-0">
                    {sale.first_name} {sale.last_name}
                  </p>
                  <p className="employee-title p-0 m-0">{salesKey}</p>
                  {/* Display the "key" value */}
                </div>
                <div className="employee-image">
                  <img
                    src={sale.image || "URL_TO_DEFAULT_IMAGE"}
                    alt="Employee"
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default PendingRequests;
