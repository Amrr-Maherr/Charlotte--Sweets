import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css"; // استيراد Bootstrap CSS
import L from "leaflet";

// حل مشكلة الأيقونات في Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://management.mlmcosmo.com/api/order/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  if (!order) {
    return <p>الطلب غير موجود</p>;
  }

  // فحص القيم والتأكد من أنها أرقام صالحة
  const latitude = parseFloat(order.latitude);
  const longitude = parseFloat(order.longitude);
  const isValidLatLng = !isNaN(latitude) && !isNaN(longitude); // فحص ما إذا كانا أرقامًا صالحة

  const position = isValidLatLng ? [latitude, longitude] : null; // استخدم null إذا كانت القيم غير صالحة

  // دالة لعرض تفاصيل الورد
  const renderFlowerDetails = () => {
    if (!order.flowers) return null; // لا تعرض شيء إذا لم تكن هناك ورود

    return (
      <div className="col-md-6 px-2 my-4">
        <div className="card mb-3 h-100 d-flex flex-column">
          <div className="card-body">
            <h5 className="card-title">تفاصيل الورد</h5>
            {/* هنا تعرض تفاصيل الورد بناءً على البيانات المتوفرة */}
            <p>
              <strong>نوع الورد:</strong> {order.flowers.type || "غير محدد"}
            </p>
            <p>
              <strong>الكمية:</strong> {order.flower_quantity || "غير محدد"}
            </p>
            <p>
              <strong>السعر:</strong> {order.flower_price || "غير محدد"}
            </p>
            {/* يمكنك إضافة المزيد من التفاصيل هنا */}
          </div>
        </div>
      </div>
    );
  };

  // دالة لعرض تفاصيل الكيك
  const renderCakeDetails = () => {
    if (!order.product) return null; // لا تعرض شيء إذا لم يكن هناك كيك

    return (
      <div className="col-md-6 px-2 my-4">
        <div className="card mb-3 h-100 d-flex flex-column">
          <div className="card-body">
            <h5 className="card-title">تفاصيل الكيك</h5>
            {/* هنا تعرض تفاصيل الكيك بناءً على البيانات المتوفرة */}
            <p>
              <strong>اسم الكيك:</strong> {order.product.name || "غير محدد"}
            </p>
            <p>
              <strong>الوصف:</strong>{" "}
              {order.product.description || "لا يوجد وصف"}
            </p>
            <p>
              <strong>السعر:</strong> {order.price || "غير محدد"}
            </p>
            {/* يمكنك إضافة المزيد من التفاصيل هنا */}
            {order.product.image && (
              <img
                src={order.product.image}
                alt="صورة الكيك"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div dir="rtl" className="container mt-4">
      <div className="row">
        {/* معلومات الطلب الأساسية ومعلومات العميل */}
        <div className="col-md-4 px-2 my-4">
          <div className="card mb-3 h-100 d-flex flex-column">
            <div className="card-body">
              <h5 className="card-title">معلومات الطلب والعميل</h5>
              <p>
                <strong>رقم الطلب:</strong> {order.id}
              </p>
              <p>
                <strong>نوع الطلب:</strong> {order.order_type}
              </p>
              <p>
                <strong>حالة الطلب:</strong> {order.status}
              </p>
              <p>
                <strong>اسم العميل:</strong> {order.customer_name}
              </p>
              <p>
                <strong>هاتف العميل:</strong> {order.customer_phone}
              </p>
            </div>
          </div>
        </div>

        {/* معلومات الدفع */}
        <div className="col-md-4 px-2 my-4">
          <div className="card mb-3 h-100 d-flex flex-column">
            <div className="card-body">
              <h5 className="card-title">معلومات الدفع</h5>
              <p>
                <strong>طريقة الدفع:</strong> {order.payment_method}
              </p>
              <p>
                <strong>السعر الكلي:</strong> {order.total_price}
              </p>
              <p>
                <strong>المقدم:</strong> {order.deposit}
              </p>
              <p>
                <strong>المتبقي:</strong> {order.remaining}
              </p>
              <p>
                <strong>سعر التوصيل:</strong>{" "}
                {order.delivery_price || "غير محدد"}
              </p>
            </div>
          </div>
        </div>

        {/* معلومات الأفراد (البائع، الشيف، عامل التوصيل) */}
        <div className="col-md-4 px-2 my-4">
          <div className="card mb-3 h-100 d-flex flex-column">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title">معلومات الأفراد</h5>
                {order.sale && (
                  <>
                    <h6 className="card-subtitle mb-2 text-muted">البائع</h6>
                    {order.sale.image && (
                      <img
                        src={order.sale.image}
                        alt="صورة البائع"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        className="mb-2"
                      />
                    )}
                    <p>
                      <strong>اسم البائع:</strong> {order.sale.first_name}{" "}
                      {order.sale.last_name}
                    </p>
                    <p>
                      <strong>هاتف البائع:</strong> {order.sale.phone}
                    </p>
                  </>
                )}
                {order.chef && (
                  <>
                    <h6 className="card-subtitle mb-2 text-muted">الشيف</h6>
                    {order.chef.image && (
                      <img
                        src={order.chef.image}
                        alt="صورة الشيف"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        className="mb-2"
                      />
                    )}
                    <p>
                      <strong>اسم الشيف:</strong> {order.chef.first_name}{" "}
                      {order.chef.last_name}
                    </p>
                    <p>
                      <strong>هاتف الشيف:</strong> {order.chef.phone}
                    </p>
                  </>
                )}
                {order.delivery && (
                  <>
                    <h6 className="card-subtitle mb-2 text-muted">
                      عامل التوصيل
                    </h6>
                    {order.delivery.image && (
                      <img
                        src={order.delivery.image}
                        alt="صورة عامل التوصيل"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        className="mb-2"
                      />
                    )}
                    <p>
                      <strong>اسم عامل التوصيل:</strong>{" "}
                      {order.delivery.first_name} {order.delivery.last_name}
                    </p>
                    <p>
                      <strong>هاتف عامل التوصيل:</strong> {order.delivery.phone}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* عرض تفاصيل الورد أو الكيك بناءً على وجودهما */}
        {order.flowers && renderFlowerDetails()}
        {order.product && renderCakeDetails()}

        {/* الخريطة ومعلومات التوصيل المدمجة */}
        <div className="col-md-12 px-2">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">معلومات التوصيل والخريطة</h5>
              <p>
                <strong>وصف العنوان:</strong> {order.map_desc}
              </p>
              <p>
                <strong>بيانات إضافية:</strong>{" "}
                {order.additional_data || "لا يوجد"}
              </p>
              {order.product_id && (
                <p>
                  <strong>معرف المنتج:</strong> {order.product_id}
                </p>
              )}
              {order.rejection_cause && (
                <p>
                  <strong>سبب الرفض:</strong> {order.rejection_cause}
                </p>
              )}
              {isValidLatLng ? (
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={position}>
                    <Popup>{order.map_desc}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p>لا يمكن عرض الخريطة بسبب عدم وجود بيانات موقع صالحة.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
