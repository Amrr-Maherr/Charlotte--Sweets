import React, { useEffect, useState } from "react";
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

// تصحيح مشكلة الأيقونات في Leaflet
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/branches",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBranchesData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDelete = (id) => {
    axios
      .delete(`https://management.mlmcosmo.com/api/branches/${id}`)
      .then((response) => {
        toast.success(response.data);
        setBranchesData(branchesData.filter((branch) => branch.id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

const handleSubmit = async () => {
  try {
    // تحقق من أن جميع الحقول المطلوبة مُدخلة
    if (!name || !address || !phone || !long || !lat) {
      toast.error("الرجاء ملء جميع الحقول.");
      return;
    }

    const data = {
      name,
      address,
      phone,
      long: String(long), // تحويل خط الطول إلى سلسلة نصية
      lat: String(lat), // تحويل خط العرض إلى سلسلة نصية
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

    toast.success("تم إضافة الفرع بنجاح!");
    setBranchesData([...branchesData, response.data]); // Update local state
    handleCloseModal();
  } catch (error) {
    console.error("Error adding branch:", error);
    toast.error(error.response?.data?.message || "حدث خطأ أثناء إضافة الفرع.");
  }
};
  // Component to handle map clicks
  function MapEvents() {
    const map = useMapEvents({
      click: (e) => {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        toast.success(
          `تم اختيار الموقع: خط عرض ${e.latlng.lat}, خط طول ${e.latlng.lng}`
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
                <div className="col-12 mt-5 d-flex align-items-center justify-content-between">
                  <AddButton ButtonText="اضافة" onClick={handleShowModal} />
                  <h1 className="branches-title">الفروع</h1>
                </div>
                <div className="col-12 mt-3">
                  <table className="table branches-table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">الاجراءات</th>
                        <th scope="col">مدير الفرع</th>
                        <th scope="col">العنوان</th>
                        <th scope="col">اسم الفرع</th>
                      </tr>
                    </thead>
                    <tbody className="branches-table-body">
                      {branchesData.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            No Branches to be displayed
                          </td>
                        </tr>
                      ) : (
                        branchesData.map((branch) => (
                          <motion.tr
                            initial={{ translateX: "-100vw" }}
                            animate={{ translateX: "0" }}
                            key={branch.id}
                            className="branches-table-row"
                          >
                            <td className="actions">
                              <motion.div
                                onClick={() => {
                                  handleDelete(branch.id);
                                }}
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.8 }}
                                className="action-icon delete-icon"
                              >
                                <img src={deleteIcon} alt="حذف" />
                              </motion.div>
                              <Link
                                to={`/dashboard/branch-details/${branch.id}`}
                                className="action-icon view-icon"
                              >
                                <motion.div
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.8 }}
                                >
                                  <img src={eye} alt="عرض التفاصيل" />
                                </motion.div>
                              </Link>
                            </td>
                            <td>
                              {branch.manager
                                ? `${branch.manager.first_name} ${branch.manager.last_name}`
                                : "لا يوجد مدير"}
                            </td>
                            <td>{branch.address.slice(0, 10)}...</td>
                            <td>{branch.name.slice(0, 10)}...</td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
                إضافة فرع جديد
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
                    <p>خط العرض: {lat}</p>
                    <p>خط الطول: {long}</p>
                  </div>
                )}
              </div>
              <div className="form-container">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    الاسم
                  </label>
                  <input
                    placeholder="ادخل اسم الفرع..."
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
                    العنوان
                  </label>
                  <input
                    placeholder="ادخل عنوان الفرع..."
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
                    رقم الجوال
                  </label>
                  <input
                    placeholder="أدخل رقم الهاتف الخاص بالفرع..."
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
                    ارسال
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
