import "../../../Style/Ads/Ads.css";
import icon from "../../../Assets/Icon.png";
import DeleteIcon from "../../../Assets/deleteButton.svg"
import Eye from "../../../Assets/eye.svg"
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
function Ads() {
  const [adTitle, setTitle] = useState("");
    const [adImg, setImage] = useState(null);
    const [AdsData, setAdsData] = useState([])
    const [loading,setLoading] = useState(true)
    const token = JSON.parse(localStorage.getItem("AuthToken"));
     const getData = () => {
       axios
         .get("https://management.mlmcosmo.com/api/banners", {
           headers: { Authorization: `Bearer ${token}` },
         })
         .then((response) => {
             setAdsData(response.data);
             console.log(response.data);
             
             setLoading(false)
         })
         .catch((error) => {
             console.log(error.response.data.message);
             setLoading(true)
         });
     };
 useEffect(() => {
   getData();
 }, [token]);
  const handleAdd = () => {
    if (!adTitle || !adImg) {
        toast.error("يرجى ملء جميع الحقول قبل الإرسال");
      return;
    }

    const formData = new FormData();
    formData.append("title", adTitle);
    formData.append("image", adImg);

    axios
      .post("https://management.mlmcosmo.com/api/banner", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
          toast.success(response.data);
          getData()
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    };
    const handelDelete = (id) => {
      axios
        .delete(`https://management.mlmcosmo.com/api/banner/${id}`,{headers:{Authorization:`Bearer ${token}`}})
        .then((response) => {
          console.log(response.data.message || "Deleted successfully");
          getData();
        })
        .catch((error) => {
          console.log(error?.response?.data?.message || "An error occurred");
        });
    };

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <section className="ads-section">
            <div className="container ads-container">
              <div className="row ads-row">
                <div className="col-12 ads-col">
                  <div className="ads-card">
                    <div className="card-content">
                      <div className="ads-card-text">
                        <p>
                          قم بتحميل الصورة الخاصة بك هنا.
                          <strong> إرشادات مهمة:</strong> 1200 × 800 بكسل أو
                          نسبة 12:8. التنسيق المدعوم{" "}
                          <strong>.jpg أو .jpeg أو .png</strong>
                        </p>
                      </div>
                      <div className="ads-img-placeholder">
                        <img src={icon} alt="upload icon" />
                      </div>
                    </div>
                    <div className="ads-btn-container">
                      <motion.button
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                        className="ads-upload-btn"
                      >
                        ارفع صورة
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table class="table table-hover text-center ads-table">
                      <thead>
                        <tr>
                          <th scope="col">الاجرائات</th>
                          <th scope="col">اسم الاعلان</th>
                          <th scope="col">#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AdsData.length === 0 ? (
                          <>
                            <tr>
                              <td colSpan="4" className="text-center">
                                لا توجد إعلانات متاحة حاليًا
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            {AdsData.map((ad) => (
                              <tr key={ad.id}>
                                <td>
                                  <div className="actions">
                                    <img
                                      src={DeleteIcon}
                                      alt=""
                                      onClick={() => {
                                        handelDelete(ad.id);
                                      }}
                                    />
                                    <Link to={`/dashboard/add-details/${ad.id}`}>
                                      <img src={Eye} alt="" />
                                    </Link>
                                  </div>
                                </td>
                                <td>{ad.title}</td>
                                <td>{ad.id}</td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      {/* مودال رفع الإعلان */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                رفع الإعلان
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3 w-100 form-group">
                <label
                  htmlFor="branchName"
                  className="form-label w-100 text-end"
                >
                  العنوان
                </label>
                <input
                  type="text"
                  id="branchName"
                  className="form-control text-end"
                  placeholder="ادخل عنوان الاعلان"
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="mb-3 w-100 form-group">
                <label htmlFor="adImage" className="form-label w-100 text-end">
                  صورة الإعلان
                </label>
                <input
                  type="file"
                  id="adImage"
                  className="form-control"
                  onChange={(event) => setImage(event.target.files[0])}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                إغلاق
              </button>
              <button
                onClick={handleAdd}
                type="button"
                className="btn"
                style={{ backgroundColor: "#A9411D", color: "white" }}
              >
                إرسال الإعلان
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default Ads;
