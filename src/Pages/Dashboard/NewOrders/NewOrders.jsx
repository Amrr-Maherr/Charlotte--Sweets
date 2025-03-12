import axios from "axios";
import { useEffect, useState } from "react";
import "../../../Style/NewOrders/NewOrders.css";
import Eye from "../../../Assets/eye.svg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function NewOrders() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/new-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data with all data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new orders:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    // Function to filter data based on Delivery Date
    const filterData = () => {
      let filtered = Data;

      // Filter by Delivery Date if a date is selected
      if (selectedDate) {
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
        filtered = filtered.filter((order) => {
          return (
            order.delivery_date && order.delivery_date.includes(formattedDate)
          );
        });
      }

      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page after filtering
    };

    filterData();
  }, [selectedDate, Data]);

  // Function to handle Delivery Date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="container new-order-container">
        <div className="row new-order-row">
          <div className="col-6 mt-5 text-start new-order-title">
            <h1>New Orders</h1>
          </div>

          {/* Delivery Date Search Input */}
          <div className="col-6 mt-3">
            <label htmlFor="deliveryDateSearch" className="form-label">
              Search by Delivery Date:
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select a date"
            />
          </div>

          <div className="col-12 mt-5">
            <table className="table text-center new-order-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order Type</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 25,
                      delay: 0.1 * index,
                    }}
                    key={order.id}
                  >
                    <td>{order.id}</td>
                    <td>{order.order_type || "No Type"}</td>
                    <td>{order.total_price || "No Price"}</td>
                    <td>
                      <div className="actions">
                        <Link to={`/dashboard/order-details/${order.id}`}>
                          <img src={Eye} alt="" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center">
            <button
              style={{
                backgroundColor: "rgba(169, 65, 29, 1)",
                color: "white",
              }}
              className="btn mx-2"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn mx-2"
              style={{
                backgroundColor: "rgba(169, 65, 29, 1)",
                color: "white",
              }}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewOrders;
