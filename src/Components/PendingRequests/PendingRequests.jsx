import { useEffect, useState } from "react";
import "../../Style/PendingRequests/PendingRequests.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Acc from "../../Assets/Group 13.png";
import Del from "../../Assets/Group 12.png";
import Swal from "sweetalert2"; // Import SweetAlert2

function PendingRequests() {
  const [managers, setManagers] = useState([]);
  const [sales, setSales] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [managerRole, setManagerRole] = useState("");
  const [salesRole, setSalesRole] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/pending-managers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Managers Data:", response.data.data);
        setManagers(response.data.data.slice(0, 10));
        setManagerRole(response.data.key);
      } catch (error) {
        console.error("Error fetching managers:", error);
        console.error("Error message:", error.response?.data?.message);
      }
    };

    if (token) {
      fetchManagers();
    } else {
      console.warn("No AuthToken found in localStorage. Managers not fetched.");
      setManagers([]); // Set to empty array if no token
    }
  }, [token]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/pending-sales",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Sales Data:", response.data.data);
        setSales(response.data.data.slice(0, 10));
        setSalesRole(response.data.key);
      } catch (error) {
        console.error("Error fetching sales:", error);
        console.error("Error message:", error.response?.data?.message);
      }
    };

    if (token) {
      fetchSales();
    } else {
      console.warn("No AuthToken found in localStorage. Sales not fetched.");
      setSales([]); // Set to empty array if no token
    }
  }, [token]);

  const handleAcceptManager = (managerId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "أنت على وشك قبول طلب هذا المدير!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قبوله!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `https://management.mlmcosmo.com/api/accept-manager/${managerId}`,
            {},
            {
              // The empty object {} is the request body
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire("تم القبول!", "تم قبول طلب المدير بنجاح.", "success");
            // Update the list of managers after accepting
            setManagers(managers.filter((manager) => manager.id !== managerId));
          })
          .catch((error) => {
            console.error("Error accepting manager:", error);
            Swal.fire("خطأ!", "حدث خطأ أثناء قبول طلب المدير.", "error");
          });
      }
    });
  };

  const handleDeclineManager = (managerId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "أنت على وشك رفض طلب هذا المدير!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، رفضه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://management.mlmcosmo.com/api/reject-manager/${managerId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire("تم الرفض!", "تم رفض طلب المدير بنجاح.", "success");
            // Update the list of managers after declining
            setManagers(managers.filter((manager) => manager.id !== managerId));
          })
          .catch((error) => {
            console.error("Error declining manager:", error);
            Swal.fire("خطأ!", "حدث خطأ أثناء رفض طلب المدير.", "error");
          });
      }
    });
  };

  const handleAcceptSale = (saleId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "أنت على وشك قبول طلب هذا المندوب!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قبوله!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `https://management.mlmcosmo.com/api/accept-sale/${saleId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire("تم القبول!", "تم قبول طلب المندوب بنجاح.", "success");
            setSales(sales.filter((sale) => sale.id !== saleId));
          })
          .catch((error) => {
            console.error("Error accepting sale:", error);
            Swal.fire("خطأ!", "حدث خطأ أثناء قبول طلب المندوب.", "error");
          });
      }
    });
  };

  const handleDeclineSale = (saleId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "أنت على وشك رفض طلب هذا المندوب!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، رفضه!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://management.mlmcosmo.com/api/reject-sale/${saleId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire("تم الرفض!", "تم رفض طلب المندوب بنجاح.", "success");
            setSales(sales.filter((sale) => sale.id !== saleId));
          })
          .catch((error) => {
            console.error("Error rejecting sale:", error);
            Swal.fire("خطأ!", "حدث خطأ أثناء رفض طلب المندوب.", "error");
          });
      }
    });
  };

  return (
    <>
      <div className="PendingRequests-title">
        <Link to="/dashboard/all-requests">شاهد الكل</Link>
        <h5>طلبات الاضافه</h5>
      </div>
      <div className="main-parent pending-requests-container shadow">
        {managers.length === 0 ? (
          <p className="text-end p-3" style={{ fontFamily: "cairo" }}>
            لا توجد طلبات مدراء معلقة.
          </p>
        ) : (
          managers.map((manager) => (
            <div key={manager.id} className="manager-item pending-request-item">
              <div className="manager-actions pending-requests-actions">
                <img
                  src={Del}
                  alt="Decline"
                  className="action-icon decline-icon"
                  onClick={() => handleDeclineManager(manager.id)}
                />
                <img
                  src={Acc}
                  alt="Accept"
                  className="action-icon accept-icon"
                  onClick={() => handleAcceptManager(manager.id)}
                />
              </div>
              <div className="manager-details pending-requests-details">
                <div className="manager-info pending-requests-info">
                  <h4 className="manager-name pending-requests-name">
                    {manager.first_name} {manager.last_name}
                  </h4>
                  <p className="manager-role pending-requests-role text-end">
                    {managerRole}
                  </p>
                </div>
                <div className="manager-image pending-requests-image">
                  <img
                    src={manager.image || ""}
                    alt={`${manager.first_name} ${manager.last_name}`}
                    className="manager-img"
                  />
                </div>
              </div>
            </div>
          ))
        )}

        {sales.length === 0 ? (
          <p className="text-end p-3" style={{ fontFamily: "cairo" }}>
            لا توجد طلبات مندوبين مبيعات معلقة.
          </p>
        ) : (
          sales.map((sale) => (
            <div key={sale.id} className="manager-item pending-request-item">
              <div className="manager-actions pending-requests-actions">
                <img
                  src={Del}
                  alt="Decline"
                  className="action-icon decline-icon"
                  onClick={() => handleDeclineSale(sale.id)}
                />
                <img
                  src={Acc}
                  alt="Accept"
                  className="action-icon accept-icon"
                  onClick={() => handleAcceptSale(sale.id)}
                />
              </div>
              <div className="manager-details pending-requests-details">
                <div className="manager-info pending-requests-info">
                  <h4 className="manager-name pending-requests-name">
                    {sale.first_name} {sale.last_name}
                  </h4>
                  <p className="manager-role pending-requests-role text-end">
                    {salesRole}
                  </p>
                </div>
                <div className="manager-image pending-requests-image">
                  <img
                    src={sale.image || ""}
                    alt={`${sale.first_name} ${sale.last_name}`}
                    className="manager-img"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default PendingRequests;
