import { useEffect, useState } from "react";
import axios from "axios"; // تأكد من استيراد axios
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// دالة لتوليد ألوان عشوائية
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function Chart() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true); // حالة تحميل البيانات
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  // دالة لجلب البيانات
  useEffect(() => {
    setIsLoading(true); // يبدأ تحميل البيانات
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
        setIsLoading(false); // ينتهي تحميل البيانات
      });
  }, [selectedYear]);

  // تحديد السنة الحالية وإضافة سنوات مستقبلية (مثلاً 5 سنوات قادمة)
  const currentYear = new Date().getFullYear();
  const futureYears = Array.from(
    { length: 100 },
    (_, index) => currentYear + index
  ); // السنوات من الحالية حتى 5 سنوات قادمة

  if (isLoading) {
    return <div>Loading...</div>; // عرض مؤشر تحميل إذا كانت البيانات قيد التحميل
  }

  return (
    <div className="d-flex align-items-center justify-content-between flex-column">
      <div className="d-flex align-items-center justify-content-between w-100 py-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            width: "80px",
            height: "25px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
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
          margin: "auto",
                  backgroundColor: "white",
          borderRadius:"10px"
        }}
        className="my-4"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" // تم التعديل هنا
              cy="50%" // تم التعديل هنا
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={generateRandomColor()} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal"
              wrapperStyle={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                padding: "20px 10px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
