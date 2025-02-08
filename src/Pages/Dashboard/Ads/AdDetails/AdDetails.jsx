import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../../Style/AdDetails/AdDetails.css";
import Loader from "../../Loader/Loader";

function AdDetails() {
  const { id } = useParams();
  const token = JSON.parse(localStorage.getItem("AuthToken")) // لا داعي لـ JSON.parse لأن التوكن نص
  const [Data, setData] = useState({}); // ضبط الحالة الأولية ككائن
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://management.mlmcosmo.com/api/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data); // تعيين الكائن المسترجع مباشرةً
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response?.data?.message || "Error fetching data");
        setLoading(false); // التأكد من إنهاء التحميل عند الخطأ
      });
  }, [token, id]);

  return (
    <section>
      {loading ? (
        <Loader />
      ) : (
        <div className="container single-add-container">
          <div className="row single-add-row">
            <div className="col-12 single-add-col">
              <div className="single-add-card">
                <div className="single-add-image">
                  <img src={Data.image} alt={Data.title || "Ad Image"} />
                </div>
                <div className="single-add-title m-1">
                  <p>{Data.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdDetails;
