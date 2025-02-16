import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Loader from "../Pages/Dashboard/Loader/Loader";

function Chart() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

 const COLORS = {
   New: "rgba(55, 205, 47, 1)",
   Completed: "rgba(244, 67, 54, 1)",
   Pending: "rgba(172, 13, 108, 1)",
   Delivered: "rgba(99, 96, 253, 1)",
   Returned: "rgba(115, 212, 233, 1)",
   Declined: "rgba(255, 174, 52, 1)",
 };

  useEffect(() => {
    setIsLoading(true);
    if (!token) {
      console.log("No AuthToken found in localStorage");
      return;
    }

    axios
      .get(
        `https://management.mlmcosmo.com/api/percentages?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const chartData = [
          { name: "New", value: response.data.newOrdersPercentage },
          { name: "Completed", value: response.data.completedOrdersPercentage },
          { name: "Pending", value: response.data.pendingOrdersPercentage },
          { name: "Delivered", value: response.data.deliveredOrdersPercentage },
          { name: "Returned", value: response.data.returnedOrdersPercentage },
          { name: "Declined", value: response.data.declinedOrdersPercentage },
        ];

        setData(chartData);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedYear, token]);

  const currentYear = new Date().getFullYear();
  const futureYears = Array.from(
    { length: 100 },
    (_, index) => currentYear + index
  );

  return (
    <>
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between flex-column">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ marginBottom: "10px", width: "226px" }}
            >
              <select
                className="shadow me-auto"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  width: "80px",
                  height: "25px",
                  borderRadius: "8px",
                  border: "none",
                  outline: "none",
                  color: "rgba(115, 115, 115, 1)",
                }}
              >
                {futureYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <h1
                style={{
                  fontSize: "12px",
                  fontFamily: "cairo",
                  fontWeight: "600",
                  textAlign: "right",
                }}
              >
                Chart
              </h1>
            </div>
            <div
              style={{
                width: "226px",
                height: "285px",
                margin: "auto",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
              className="shadow"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name]} // Use predefined colors
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    wrapperStyle={{
                      display: "flex",
                      justifyContent: "space-around",
                      flexWrap: "wrap",
                      padding: "10px",
                      fontSize: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Chart;
