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
    مكتملة: "rgba(244, 67, 54, 1)",
    "قيد التنفيذ": "rgba(172, 13, 108, 1)",
    جديدة: "rgba(55, 205, 47, 1)",
    مرفوضة: "rgba(255, 174, 52, 1)",
    مرتجعة: "rgba(115, 212, 233, 1)",
    منتهيه: "rgba(99, 96, 253, 1)",
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
          { name: "جديدة", value: response.data.newOrdersPercentage },
          { name: "مكتملة", value: response.data.completedOrdersPercentage },
          { name: "قيد التنفيذ", value: response.data.pendingOrdersPercentage },
          { name: "منتهيه", value: response.data.deliveredOrdersPercentage },
          { name: "مرتجعة", value: response.data.returnedOrdersPercentage },
          { name: "مرفوضة", value: response.data.declinedOrdersPercentage },
        ];

        setData(chartData);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedYear]);

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
          <div className="d-flex align-items-center justify-content-between flex-column mt-4">
            <div className="d-flex align-items-center justify-content-between w-100">
              <select
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
                مخطط بيانى
              </h1>
            </div>
            <div
              style={{
                width: "100%",
                height: "240px",
                margin: "auto",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
              className="my-4 shadow"
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
                      fontSize: "12px",
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
