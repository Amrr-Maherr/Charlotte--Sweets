import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import L from "leaflet";
import PropTypes from "prop-types"; // Import PropTypes

// Solve the Leaflet icon problem
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Constants
const NO_LOCATION_DATA = "No valid location data available.";

// Helper functions to display data conditionally
const displayField = (label, value) => {
  // Do not display fields containing "id" (case-insensitive)
  if (label.toLowerCase().includes("id")) {
    return null;
  }

  if (value !== null && value !== undefined && value !== "") {
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">
        <strong>{label}:</strong>
        <span>{value.toString()}</span>
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
            `${label} Name`,
            `${object.first_name} ${object.last_name}`
          )}
          {displayField(`${label} Phone`, object.phone)}
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
          {displayField(`${label} Name`, product.name)}
          {displayField(`Description`, product.description)}
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
          {displayField(`${label} Type`, flowers.type)}
          {/* Add more fields here as needed */}
        </ul>
      </div>
    );
  }
  return null;
};

//Reusable Components
const CommonOrderInfo = ({ order }) => {
  return (
    <div className="col-md-6 px-2 mb-4">
      <div className="card shadow">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Order and Customer Information</h5>
          <ul className="list-group list-group-flush flex-grow-1">
            {displayField("Order Number", order.id)}
            {displayField("Order Type", order.order_type)}
            {displayField("Order Status", order.status)}
            {displayField("Customer Name", order.customer_name)}
            {displayField("Customer Phone", order.customer_phone)}
            {displayField("Delivery Date", order.delivery_date)}
            {displayField("Delivery Time", order.delivery_time)}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({ order }) => {
  return (
    <div className="col-md-6 px-2 mb-4">
      <div className="card shadow">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Payment Information</h5>
          <ul className="list-group list-group-flush flex-grow-1">
            {displayField("Payment Method", order.payment_method)}
            {displayField("Total Price", order.total_price)}
            {displayField("Deposit", order.deposit)}
            {displayField("Remaining", order.remaining)}
            {displayField("Delivery Price", order.delivery_price)}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PersonnelInfo = ({ order }) => {
  return (
    <div className="col-md-4 px-2 mb-4">
      <div className="card shadow">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Personnel Information</h5>
          <div className="flex-grow-1">
            {displayObjectInfo("Seller", order.sale)}
            {displayObjectInfo("Chef", order.chef)}
            {order.delivery &&
              displayObjectInfo("Delivery Person", order.delivery)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageGallery = ({ images }) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <div className="col-md-4 px-2 mb-4">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">Additional Images</h5>
          <div className="d-flex flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={`Additional Image ${index + 1}`}
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
  );
};
// Component for displaying Cake Order Details
const CakeOrderDetails = ({ order }) => {
  return (
    <>
      <h2 className="mb-4">Cake Order Details</h2>
      <div className="row">
        <CommonOrderInfo order={order} />
        <PaymentInfo order={order} />
        <PersonnelInfo order={order} />
        <div className="col-md-4 px-2 mb-4">
          {" "}
          {/* New Card Container */}
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Cake Information</h5>
              {displayField("Cake Name", order.order_details)}
              {displayField("Cake Price", order.cake_price)}
              {displayField("Is Same Day", order.is_sameday)}
            </div>
          </div>
        </div>
        <ImageGallery images={order.images} />
      </div>
    </>
  );
};

// Component for displaying Flower Order Details
const FlowerOrderDetails = ({ order }) => {
  return (
    <>
      <h2 className="mb-4">Flower Order Details</h2>
      <div className="row">
        <CommonOrderInfo order={order} />
        <PaymentInfo order={order} />
        <PersonnelInfo order={order} />
        <div className="col-md-4 px-2 mb-4">
          {" "}
          {/* New Card Container */}
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Flower Information</h5>
              {displayField("Description", order.description)}
              {displayField("Flower Price", order.flower_price)}
              {displayField("Is Same Day", order.is_sameday)}
            </div>
          </div>
        </div>
        <ImageGallery images={order.images} />
      </div>
    </>
  );
};

// Component for displaying Cake and Flower Order Details
const CakeAndFlowerOrderDetails = ({ order }) => {
  return (
    <>
      <h2 className="mb-4">Cake and Flower Order Details</h2>
      <div className="row">
        <CommonOrderInfo order={order} />
        <PaymentInfo order={order} />
        <PersonnelInfo order={order} />
        <div className="col-md-4 px-2 mb-4">
          {" "}
          {/* New Card Container */}
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Cake Information</h5>
              {displayField("Cake Name", order.order_details)}
              {displayField("Cake Price", order.cake_price)}
            </div>
          </div>
        </div>
        <div className="col-md-4 px-2 mb-4">
          {" "}
          {/* New Card Container */}
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Flower Information</h5>
              {displayField("Description", order.description)}
              {displayField("Flower Price", order.flower_price)}
              {displayField("Is Same Day", order.is_sameday)}
            </div>
          </div>
        </div>
        <ImageGallery images={order.images} />
      </div>
    </>
  );
};
const UnsupportedOrder = ({ order }) => {
  return (
    <>
      <p>Unsupported order type: {order.order_type}</p>
    </>
  );
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
          setError("Please login.");
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
        setError(
          "An error occurred while fetching order data. Please try again."
        );
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  // Define PropTypes inside the component function
  const commonOrderPropTypes = {
    id: PropTypes.number.isRequired,
    order_type: PropTypes.string.isRequired,
    status: PropTypes.string,
    customer_name: PropTypes.string,
    customer_phone: PropTypes.string,
    delivery_time: PropTypes.string,
    delivery_date: PropTypes.string,
    longitude: PropTypes.string,
    latitude: PropTypes.string,
    map_desc: PropTypes.string,
    additional_data: PropTypes.string,
    rejection_cause: PropTypes.string,
    payment_method: PropTypes.string,
    total_price: PropTypes.number,
    deposit: PropTypes.number,
    delivery_price: PropTypes.number,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string.isRequired,
      })
    ),
    sale: PropTypes.shape({
      id: PropTypes.number,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      phone: PropTypes.string,
      image: PropTypes.string,
    }),
    chef: PropTypes.shape({
      id: PropTypes.number,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      phone: PropTypes.string,
      image: PropTypes.string,
    }),
    delivery: PropTypes.shape({
      id: PropTypes.number,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      phone: PropTypes.string,
      image: PropTypes.string,
    }),
  };

  const cakeOrderPropTypes = {
    order_details: PropTypes.string,
    cake_price: PropTypes.number,
    is_sameday: PropTypes.number,
  };

  const flowerOrderPropTypes = {
    description: PropTypes.string,
    flower_price: PropTypes.number,
    is_sameday: PropTypes.number,
  };

  const isValidLatLng = useMemo(() => {
    if (!order) return false;
    const latitude = parseFloat(order.latitude);
    const longitude = parseFloat(order.longitude);
    return !isNaN(latitude) && !isNaN(longitude);
  }, [order]);

  const position = useMemo(() => {
    if (!order || !isValidLatLng) return null;
    return [parseFloat(order.latitude), parseFloat(order.longitude)];
  }, [order, isValidLatLng]);

  const renderOrderDetails = () => {
    if (!order) return null;
    switch (order.order_type) {
      case "cake":
        return <CakeOrderDetails order={order} />;
      case "flower":
        return <FlowerOrderDetails order={order} />;
      case "cake and flower":
        return <CakeAndFlowerOrderDetails order={order} />;
      default:
        return <UnsupportedOrder order={order} />;
    }
  };
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>;
  }

  if (!order) {
    return <p>Order not found</p>;
  }

  return (
    <div dir="ltr" className="container order-details-container mt-4">
      {renderOrderDetails()}

      {/* Delivery and Map Information */}
      <div className="row">
        <div className="col-md-12 px-2 mb-4">
          <div className="card shadow">
            {/* Removed h-100 */}
            <div className="card-body d-flex flex-column">
              {/* Added flexbox */}
              <h5 className="card-title">Delivery and Map Information</h5>
              <ul className="list-group list-group-flush">
                {displayField("Address Description", order.map_desc)}
                {displayField("Additional Data", order.additional_data)}
                {displayField("Product ID", order.product_id)}
                {displayField("Rejection Cause", order.rejection_cause)}
              </ul>
              {isValidLatLng && position ? (
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
                <p className="text-muted">{NO_LOCATION_DATA}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderDetails.propTypes = {
  id: PropTypes.number,
  order_type: PropTypes.string,
  status: PropTypes.string,
  customer_name: PropTypes.string,
  customer_phone: PropTypes.string,
  delivery_time: PropTypes.string,
  delivery_date: PropTypes.string,
  longitude: PropTypes.string,
  latitude: PropTypes.string,
  map_desc: PropTypes.string,
  additional_data: PropTypes.string,
  rejection_cause: PropTypes.string,
  payment_method: PropTypes.string,
  total_price: PropTypes.number,
  deposit: PropTypes.number,
  delivery_price: PropTypes.string,
  sale: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string,
    image: PropTypes.string,
  }),
  chef: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string,
    image: PropTypes.string,
  }),
  delivery: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string,
    image: PropTypes.string,
  }),
  order_details: PropTypes.string,
  cake_price: PropTypes.number,
  is_sameday: PropTypes.number,
  description: PropTypes.string,
  flower_price: PropTypes.number,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
    })
  ),
  latitude: PropTypes.string,
  longitude: PropTypes.string,
  map_desc: PropTypes.string,
  additional_data: PropTypes.string,
  product_id: PropTypes.string,
  rejection_cause: PropTypes.string,
};

export default OrderDetails;
