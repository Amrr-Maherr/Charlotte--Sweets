import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import Acc from "../../../Assets/Group 12.png";
import Dec from "../../../Assets/Group 13.png";
import "../../../Style/AllRequests/AllRequests.css";

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchAllRequests = async () => {
      setLoading(true);
      try {
        const managersResponse = await axios.get(
          "https://management.mlmcosmo.com/api/pending-managers",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const salesResponse = await axios.get(
          "https://management.mlmcosmo.com/api/pending-sales",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allRequestsData = [
          ...(managersResponse.data.data || []).map((manager) => ({
            ...manager,
            type: "Manager",
            role: managersResponse.data.key,
          })),
          ...(salesResponse.data.data || []).map((sale) => ({
            ...sale,
            type: "Sales Representative",
            role: salesResponse.data.key,
          })),
        ];

        setRequests(allRequestsData);
        console.log("All Request Data", allRequestsData);
      } catch (error) {
        console.error("Error fetching requests:", error);
        console.error("Error message:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllRequests();
    } else {
      console.warn("No AuthToken found in localStorage. Requests not fetched.");
      setLoading(false);
    }
  }, [token]);

  const handleAccept = (id, type) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to accept this ${
        type === "Manager" ? "manager" : "sales representative"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const endpoint =
          type === "Manager"
            ? `https://management.mlmcosmo.com/api/accept-manager/${id}`
            : `https://management.mlmcosmo.com/api/accept-sale/${id}`;

        axios
          .post(
            // Changed to POST
            endpoint,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire(
              "Accepted!",
              `The ${
                type === "Manager" ? "manager" : "sales representative"
              } has been successfully accepted.`,
              "success"
            );
            setRequests(requests.filter((request) => request.id !== id));
          })
          .catch((error) => {
            console.error(`Error accepting ${type}:`, error);
            Swal.fire(
              "Error!",
              `An error occurred while accepting the ${
                type === "Manager" ? "manager" : "sales representative"
              }.`,
              "error"
            );
          });
      }
    });
  };

  const handleReject = (id, type) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to reject this ${
        type === "Manager" ? "manager" : "sales representative"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const endpoint =
          type === "Manager"
            ? `https://management.mlmcosmo.com/api/reject-manager/${id}`
            : `https://management.mlmcosmo.com/api/reject-sale/${id}`;

        axios
          .post(
            // Changed to POST
            endpoint,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire(
              "Rejected!",
              `The ${
                type === "Manager" ? "manager" : "sales representative"
              } has been successfully rejected.`,
              "success"
            );
            setRequests(requests.filter((request) => request.id !== id));
          })
          .catch((error) => {
            console.error(`Error rejecting ${type}:`, error);
            Swal.fire(
              "Error!",
              `An error occurred while rejecting the ${
                type === "Manager" ? "manager" : "sales representative"
              }.`,
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className="container">
            <h2
              className="text-start py-4"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              All Pending Requests
            </h2>
            {requests.length === 0 ? (
              <p className="text-start">No pending requests.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover text-center AllRequests-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Image</th>
                      <th>Branch</th>
                      <th style={{ width: "130px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          {request.first_name} {request.last_name}
                        </td>
                        <td>{request.type}</td> {/* Type */}
                        <td>
                          <img
                            src={request.image || ""}
                            alt={`${request.first_name} ${request.last_name}`}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        </td>
                        <td>
                          {request.branch ? request.branch.name : "No branch"}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              style={{ cursor: "pointer", margin: "0 5px" }}
                              src={Acc}
                              alt="Accept"
                              onClick={() =>
                                handleReject(request.id, request.type)
                              }
                            />
                            <img
                              style={{ cursor: "pointer", margin: "0 5px" }}
                              src={Dec}
                              alt="Reject"
                              onClick={() =>
                                handleAccept(request.id, request.type)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default AllRequests;
