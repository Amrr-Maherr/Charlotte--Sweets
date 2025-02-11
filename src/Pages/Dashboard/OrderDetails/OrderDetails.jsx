import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import L from "leaflet";

// حل مشكلة الأيقونات في Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Helper functions to display data conditionally
const displayField = (label, value) => {
  // Do not display fields containing "id" (case-insensitive)
  if (label.toLowerCase().includes("id")) {
    return null;
  }

  if (value !== null && value !== undefined) {
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">
        {" "}
        {/* Added flexbox */}
        <strong>{label}:</strong>
        <span>{value.toString()}</span> {/* Wrapped value in a span */}
      </li>
    );
  }
  return null;
};

const displayObjectInfo = (label, object) => {
  if (object && typeof object === "object") {
    return (
      <div className="mb-3">
        <h6 className="card-subtitle mb-2 text-muted">{label}</h6>
        {object.image && (
          <img
            src={object.image}
            alt={`${label} Image`}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
            className="mb-2"
          />
        )}
        <ul className="list-group list-group-flush">
          {displayField(
            `اسم ${label}`,
            `${object.first_name} ${object.last_name}`
          )}
          {displayField(`هاتف ${label}`, object.phone)}
          {/* Add more fields here as needed */}
        </ul>
      </div>
    );
  }
  return null;
};

const displayProductInfo = (label, product) => {
  if (product && typeof product === "object") {
    return (
      <div className="mb-3">
        <h6 className="card-subtitle mb-2 text-muted">{label}</h6>
        {product.image && (
          <img
            src={product.image}
            alt={`${label} Image`}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
            }}
            className="mb-2"
          />
        )}
        <ul className="list-group list-group-flush">
          {displayField(`اسم ${label}`, product.name)}
          {displayField(`الوصف`, product.description)}
          {/* Add more fields here as needed */}
        </ul>
      </div>
    );
  }
  return null;
};

const displayFlowerInfo = (label, flowers) => {
  if (flowers && typeof flowers === "object") {
    return (
      <div className="mb-3">
        <h6 className="card-subtitle mb-2 text-muted">{label}</h6>
        <ul className="list-group list-group-flush">
          {displayField(`نوع ${label}`, flowers.type)}
          {/* Add more fields here as needed */}
        </ul>
      </div>
    );
  }
  return null;
};

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setError("الرجاء تسجيل الدخول.");
          setLoading(false);
          return;
        }
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
        setError("حدث خطأ أثناء جلب بيانات الطلب. يرجى المحاولة مرة أخرى.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>;
  }

  if (!order) {
    return <p>الطلب غير موجود</p>;
  }

  // Validate latitude and longitude
  const latitude = parseFloat(order.latitude);
  const longitude = parseFloat(order.longitude);
  const isValidLatLng = !isNaN(latitude) && !isNaN(longitude);

  const position = isValidLatLng ? [latitude, longitude] : null;

  // Render UI based on order type
  const renderOrderDetails = () => {
    switch (order.order_type) {
      case "كيك":
        // Cake Order
        return (
          <>
            <h2 className="mb-4">تفاصيل طلب كيك</h2>
            <div className="row">
              {/* Order and Customer Information */}
              <div className="col-md-6 px-2 mb-4">
                <div className="card">
                  {" "}
                  {/* Removed h-100 */}
                  <div className="card-body d-flex flex-column">
                    {" "}
                    {/* Added flexbox */}
                    <h5 className="card-title">معلومات الطلب والعميل</h5>
                    <ul className="list-group list-group-flush flex-grow-1">
                      {" "}
                      {/* Added flex-grow-1 */}
                      {displayField("نوع الطلب", order.order_type)}
                      {displayField("حالة الطلب", order.status)}
                      {displayField("اسم العميل", order.customer_name)}
                      {displayField("هاتف العميل", order.customer_phone)}
                      {/* Check if product exists to determine where to get the name */}
                      {displayField("اسم الكيك", order.order_details)}
                      {displayField("تاريخ التوصيل", order.delivery_date)}
                      {displayField("وقت التوصيل", order.delivery_time)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="col-md-6 px-2 mb-4">
                <div className="card">
                  {" "}
                  {/* Removed h-100 */}
                  <div className="card-body d-flex flex-column">
                    {" "}
                    {/* Added flexbox */}
                    <h5 className="card-title">معلومات الدفع</h5>
                    <ul className="list-group list-group-flush flex-grow-1">
                      {" "}
                      {/* Added flex-grow-1 */}
                      {displayField("طريقة الدفع", order.payment_method)}
                      {displayField("السعر الكلي", order.total_price)}
                      {displayField("المقدم", order.deposit)}
                      {displayField("المتبقي", order.remaining)}
                      {displayField("سعر التوصيل", order.delivery_price)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Personnel Information */}
              <div className="col-md-4 px-2 mb-4">
                <div className="card">
                  {" "}
                  {/* Removed h-100 */}
                  <div className="card-body d-flex flex-column">
                    {" "}
                    {/* Added flexbox */}
                    <h5 className="card-title">معلومات الأفراد</h5>
                    <div className="flex-grow-1">
                      {" "}
                      {/* Added flex-grow-1 */}
                      {displayObjectInfo("البائع", order.sale)}
                      {displayObjectInfo("الشيف", order.chef)}
                      {/* Only display delivery if it exists */}
                      {order.delivery &&
                        displayObjectInfo("عامل التوصيل", order.delivery)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ImageES Information */}
              {order.images &&
                Array.isArray(order.images) &&
                order.images.length > 0 && (
                  <div className="col-md-4 px-2 mb-4">
                    <div className="card">
                      {" "}
                      {/* Removed h-100 */}
                      <div className="card-body">
                        <h5 className="card-title">صور إضافية</h5>
                        <div className="d-flex flex-wrap">
                          {order.images.map((img, index) => (
                            <img
                              key={index}
                              src={img.image}
                              alt={`صورة إضافية ${index + 1}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                margin: "5px",
                                borderRadius: "10px",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </>
        );
      case "ورد":
      case "كيك و ورد": // **Modified: Handling Cake and Flower case**
        // Flower Order
        return (
          <>
            <h2 className="mb-4">تفاصيل طلب {order.order_type}</h2>{" "}
            {/* Modified title */}
            <div className="row">
              {/* Order and Customer Information */}
              <div className="col-md-6 px-2 mb-4">
                <div className="card">
                  {" "}
                  {/* Removed h-100 */}
                  <div className="card-body d-flex flex-column">
                    {" "}
                    {/* Added flexbox */}
                    <h5 className="card-title">معلومات الطلب والعميل</h5>
                    <ul className="list-group list-group-flush flex-grow-1">
                      {" "}
                      {/* Added flex-grow-1 */}
                      {displayField("رقم الطلب", order.id)}
                      {displayField("نوع الطلب", order.order_type)}
                      {displayField("حالة الطلب", order.status)}
                      {displayField("اسم العميل", order.customer_name)}
                      {displayField("هاتف العميل", order.customer_phone)}
                      {displayField("تاريخ التوصيل", order.delivery_date)}
                      {displayField("وقت التوصيل", order.delivery_time)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="col-md-6 px-2 mb-4">
                <div className="card">
                  {" "}
                  {/* Removed h-100 */}
                  <div className="card-body d-flex flex-column">
                    {" "}
                    {/* Added flexbox */}
                    <h5 className="card-title">معلومات الدفع</h5>
                    <ul className="list-group list-group-flush flex-grow-1">
                      {" "}
                      {/* Added flex-grow-1 */}
                      {displayField("طريقة الدفع", order.payment_method)}
                      {displayField("السعر الكلي", order.total_price)}
                      {displayField("المقدم", order.deposit)}
                      {displayField("المتبقي", order.remaining)}
                      {displayField("سعر التوصيل", order.delivery_price)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Personnel Information */}
              <div className="col-md-4 px-2 mb-4">
                <div className="card">
                  {" "}
                  {/* Removed h-100 */}
                  <div className="card-body d-flex flex-column">
                    {" "}
                    {/* Added flexbox */}
                    <h5 className="card-title">معلومات الأفراد</h5>
                    <div className="flex-grow-1">
                      {" "}
                      {/* Added flex-grow-1 */}
                      {displayObjectInfo("البائع", order.sale)}
                      {/* Only display delivery if it exists */}
                      {order.delivery &&
                        displayObjectInfo("عامل التوصيل", order.delivery)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flower Information */}
              {order.flowers && (
                <div className="col-md-4 px-2 mb-4">
                  <div className="card">
                    {" "}
                    {/* Removed h-100 */}
                    <div className="card-body d-flex flex-column">
                      {" "}
                      {/* Added flexbox */}
                      <h5 className="card-title">معلومات الورد</h5>
                      <div className="flex-grow-1">
                        {displayFlowerInfo("الورد", order.flowers)}
                        {displayField("كمية الورد", order.flower_quantity)}
                        {displayField("سعر الورد", order.flower_price)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Image Information */}
              {order.image && (
                <div className="col-md-4 px-2 mb-4">
                  <div className="card">
                    {" "}
                    {/* Removed h-100 */}
                    <div className="card-body">
                      <h5 className="card-title">صورة الطلب</h5>
                      <img
                        src={order.image}
                        alt="صورة الطلب"
                        style={{ width: "100%", borderRadius: "10px" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* ImageES Information */}
              {order.images &&
                Array.isArray(order.images) &&
                order.images.length > 0 && (
                  <div className="col-md-4 px-2 mb-4">
                    <div className="card">
                      {" "}
                      {/* Removed h-100 */}
                      <div className="card-body">
                        <h5 className="card-title">صور إضافية</h5>
                        <div className="d-flex flex-wrap">
                          {order.images.map((img, index) => (
                            <img
                              key={index}
                              src={img.image}
                              alt={`صورة إضافية ${index + 1}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                margin: "5px",
                                borderRadius: "10px",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </>
        );
      default:
        return <p>نوع الطلب غير مدعوم</p>;
    }
  };

  return (
    <div dir="rtl" className="container mt-4">
      {renderOrderDetails()}

      {/* Delivery and Map Information */}
      <div className="row">
        <div className="col-md-12 px-2 mb-4">
          <div className="card">
            {" "}
            {/* Removed h-100 */}
            <div className="card-body d-flex flex-column">
              {" "}
              {/* Added flexbox */}
              <h5 className="card-title">معلومات التوصيل والخريطة</h5>
              <ul className="list-group list-group-flush">
                {displayField("وصف العنوان", order.map_desc)}
                {displayField("بيانات إضافية", order.additional_data)}
                {displayField("معرف المنتج", order.product_id)}
                {displayField("سبب الرفض", order.rejection_cause)}
              </ul>
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
                <p className="text-muted">
                  لا يمكن عرض الخريطة بسبب عدم وجود بيانات موقع صالحة.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
