import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import L from "leaflet";
import PropTypes from "prop-types";

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
const FieldDisplay = ({ label, value }) => {
  if (label.toLowerCase().includes("id")) {
    return null;
  }

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <strong>{label}:</strong>
      <span>{value ?? "Not specified"}</span>{" "}
      {/* Use nullish coalescing operator */}
    </li>
  );
};

const displayField = (label, value) => {
  return <FieldDisplay label={label} value={value} />;
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
              displayObjectInfo("Delivery", order.delivery)}
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

const MapComponent = ({ latitude, longitude, map_desc }) => {
  const isValidLatLng = useMemo(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    return !isNaN(lat) && !isNaN(lng);
  }, [latitude, longitude]);

  const position = useMemo(() => {
    if (!isValidLatLng) return null;
    return [parseFloat(latitude), parseFloat(longitude)];
  }, [isValidLatLng, latitude, longitude]);

  if (!isValidLatLng || !position) {
    return <p className="text-muted">{NO_LOCATION_DATA}</p>;
  }

  return (
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
        <Popup>{map_desc}</Popup>
      </Marker>
    </MapContainer>
  );
};

const ReturnedOrderDetails = ({ order }) => {
  return (
    <>
      <h2 className="mb-4">Returned Order Details</h2>
      <div className="row">
        <CommonOrderInfo order={order} />
        <PaymentInfo order={order} />
        <PersonnelInfo order={order} />
        <div className="col-md-4 px-2 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Return Information</h5>
              {displayField("Problem", order.problem)}
              {displayField("Rejection Cause", order.rejection_cause)}
              {displayField("Is Returned", order.is_returned ? "Yes" : "No")}
            </div>
          </div>
        </div>
        <ImageGallery images={order.images} />
      </div>
    </>
  );
};

ReturnedOrderDetails.propTypes = {
  order: PropTypes.shape({
    problem: PropTypes.string,
    rejection_cause: PropTypes.string,
    is_returned: PropTypes.number,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string,
      })
    ),
  }).isRequired,
};

const CakeOrderDetails = ({ order }) => {
  return (
    <>
      <h2 className="mb-4">Cake Order Details</h2>
      <div className="row">
        <CommonOrderInfo order={order} />
        <PaymentInfo order={order} />
        <PersonnelInfo order={order} />
        <div className="col-md-4 px-2 mb-4">
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

const FlowerOrderDetails = ({ order }) => {
  return (
    <>
      <h2 className="mb-4">Flower Order Details</h2>
      <div className="row">
        <CommonOrderInfo order={order} />
        <PaymentInfo order={order} />
        <PersonnelInfo order={order} />
        <div className="col-md-4 px-2 mb-4">
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

const CakeAndFlowerOrderDetails = ({ order }) => {
  return (
    <>
      <h2 className="mb-4">Cake and Flower Order Details</h2>
      <div className="row">
        <CommonOrderInfo order={order} />
        <PaymentInfo order={order} />
        <PersonnelInfo order={order} />
        <div className="col-md-4 px-2 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Cake Information</h5>
              {displayField("Cake Name", order.order_details)}
              {displayField("Cake Price", order.cake_price)}
            </div>
          </div>
        </div>
        <div className="col-md-4 px-2 mb-4">
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

const returnedOrderPropTypes = {
  problem: PropTypes.string,
  rejection_cause: PropTypes.string,
  is_returned: PropTypes.number,
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

  const renderOrderDetails = useCallback(() => {
    if (!order) return null;
    switch (order.order_type) {
      case "cake":
        return <CakeOrderDetails order={order} />;
      case "flower":
        return <FlowerOrderDetails order={order} />;
      case "cake and flower":
        return <CakeAndFlowerOrderDetails order={order} />;
      case "returned":
        return <ReturnedOrderDetails order={order} />;
      default:
        return <UnsupportedOrder order={order} />;
    }
  }, [order]);

  OrderDetails.propTypes = {
    ...commonOrderPropTypes,
    ...cakeOrderPropTypes,
    ...flowerOrderPropTypes,
    ...returnedOrderPropTypes,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    map_desc: PropTypes.string,
    additional_data: PropTypes.string,
    product_id: PropTypes.string,
    rejection_cause: PropTypes.string,
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
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Delivery and Map Information</h5>
              <ul className="list-group list-group-flush">
                {displayField("Address Description", order.map_desc)}
                {displayField("Additional Data", order.additional_data)}
                {displayField("Product ID", order.product_id)}
                {displayField("Rejection Cause", order.rejection_cause)}
              </ul>
              <MapComponent
                latitude={order.latitude}
                longitude={order.longitude}
                map_desc={order.map_desc}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
