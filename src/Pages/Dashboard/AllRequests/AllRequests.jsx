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
            type: "مدير",
            role: managersResponse.data.key,
          })),
          ...(salesResponse.data.data || []).map((sale) => ({
            ...sale,
            type: "مندوب مبيعات",
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
      title: "هل أنت متأكد؟",
      text: `هل أنت متأكد أنك تريد قبول هذا ${
        type === "مدير" ? "المدير" : "المندوب"
      }؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قبول!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        const endpoint =
          type === "مدير"
            ? `https://management.mlmcosmo.com/api/accept-manager/${id}`
            : `https://management.mlmcosmo.com/api/accept-sale/${id}`;

        axios
          .post(
            endpoint,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            Swal.fire(
              "تم القبول!",
              `تم قبول ${type === "مدير" ? "المدير" : "المندوب"} بنجاح.`,
              "success"
            );
            setRequests(requests.filter((request) => request.id !== id));
          })
          .catch((error) => {
            console.error(`Error accepting ${type}:`, error);
            Swal.fire(
              "خطأ!",
              `حدث خطأ أثناء قبول ${type === "مدير" ? "المدير" : "المندوب"}.`,
              "error"
            );
          });
      }
    });
  };

  const handleReject = (id, type) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `هل أنت متأكد أنك تريد رفض هذا ${
        type === "مدير" ? "المدير" : "المندوب"
      }؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، رفض!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        const endpoint =
          type === "مدير"
            ? `https://management.mlmcosmo.com/api/reject-manager/${id}`
            : `https://management.mlmcosmo.com/api/reject-sale/${id}`;

        axios
          .delete(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "تم الرفض!",
              `تم رفض ${type === "مدير" ? "المدير" : "المندوب"} بنجاح.`,
              "success"
            );
            setRequests(requests.filter((request) => request.id !== id));
          })
          .catch((error) => {
            console.error(`Error rejecting ${type}:`, error);
            Swal.fire(
              "خطأ!",
              `حدث خطأ أثناء رفض ${type === "مدير" ? "المدير" : "المندوب"}.`,
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
              className="text-end py-4"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              جميع الطلبات المعلقة
            </h2>
            {requests.length === 0 ? (
              <p className="text-end">لا توجد طلبات معلقة.</p>
            ) : (
              <table className="table table-hover text-center AllRequests-table">
                <thead>
                  <tr>
                    <th style={{ width: "130px" }}>الإجراءات</th>
                    <th>الصورة</th>
                    <th>الفرع</th>
                    <th>النوع</th>
                    <th className="text-end">الاسم</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <img
                            style={{ cursor: "pointer", margin: "0 5px" }}
                            src={Acc}
                            alt="قبول"
                            onClick={() =>
                              handleAccept(request.id, request.type)
                            }
                          />
                          <img
                            style={{ cursor: "pointer", margin: "0 5px" }}
                            src={Dec}
                            alt="رفض"
                            onClick={() =>
                              handleReject(request.id, request.type)
                            }
                          />
                        </div>
                      </td>
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
                        {request.branch ? request.branch.name : "لا يوجد فرع"}
                      </td>
                      <td>{request.type}</td>
                      <td className="text-end">
                        {request.first_name} {request.last_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default AllRequests;
