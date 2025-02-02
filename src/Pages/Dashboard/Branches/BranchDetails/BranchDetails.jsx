import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "../../../../Style/BranchDetails/BranchDetails.css"; // إضافة ملف التنسيق المخصص
import { motion } from "framer-motion";
function BranchDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    axios
      .get(`https://management.mlmcosmo.com/api/branches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
          setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching branch details:", error);
        setLoading(true);
      });
  }, [id, token]);
  return (
    <section className="branch-details-section py-5">
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="row">
            <motion.div
              initial={{ translateX: "-100vw" }}
              animate={{ translateX: "0" }}
              className="col-md-6 mb-4"
            >
              <h3 className="card-title mb-3 text-end">الخريطة</h3>
              <div className="card shadow-lg">
                <div className="card-body map-card">
                  <MapContainer center={[data.lat, data.long]} zoom={13}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[data.lat, data.long]}>
                      <Popup>{data.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ translateX: "100vw" }}
              animate={{ translateX: "0" }}
              className="col-md-6 mb-4"
            >
              <h3 className="card-title mb-3 text-end">تفاصيل الفرع</h3>
              <div className="card shadow-lg branch-card">
                <div className="card-body">
                  {data ? (
                    <div className="d-flex w-100 text-end">
                      <div className="branch-info w-70">
                        <p className="branch-name">{data.name}</p>
                        <p className="branch-address">{data.address}</p>
                        <p className="branch-manager">
                          {data.manager.first_name} {data.manager.last_name}
                        </p>
                        <p className="branch-phone">{data.phone}</p>
                      </div>
                      <div className="branch-labels w-50">
                        <p className="label">اسم الفرع</p>
                        <p className="label">عنوانه</p>
                        <p className="label">مدير الفرع</p>
                        <p className="label">رقم الجوال</p>
                      </div>
                    </div>
                  ) : (
                    <p className="card-text">لا توجد تفاصيل للفرع بعد.</p>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ translateX: "-100vw" }}
              animate={{ translateX: "0" }}
              className="col-12 chefs-list my-5"
            >
              <div className="chefs-container">
                <div className="chefs-grid container">
                  <h3 className="chefs-title text-end">الشيفات</h3>
                  <div className="row gy-4">
                    {data.chefs.map((chef, index) => (
                      <div
                        key={index}
                        className="col-xl-3 col-md-6 col-12 ms-auto chef-col"
                      >
                        <div className="card chef-card">
                          <div className="chef-info">
                            <p className="chef-name">
                              {chef.first_name} {chef.last_name}
                            </p>
                            <p className="chef-bio">{chef.bio}</p>
                          </div>
                          <div className="chef-image">
                            <img src={chef.image} alt="" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ translateX: "100vw" }}
              animate={{ translateX: "0" }}
              className="col-12 sales my-5"
            >
              <div className="container">
                <div className="row gy-4">
                  <h3 className="delivery-title text-end">مناديب المبيعات</h3>
                  {data.deliveries.map((delivery, index) => (
                    <div
                      key={index}
                      className="col-xl-3 col-md-6 col-12 ms-auto delivery-col"
                    >
                      <div className="card delivery-card">
                        <div className="delivery-info">
                          <p className="delivery-name">
                            {delivery.first_name} {delivery.last_name}
                          </p>
                        </div>
                        <div className="delivery-image">
                          <img src={delivery.image} alt={delivery.first_name} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}

export default BranchDetails;
