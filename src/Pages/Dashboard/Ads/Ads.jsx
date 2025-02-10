import "../../../Style/Ads/Ads.css";
import icon from "../../../Assets/Icon.png";
import DeleteIcon from "../../../Assets/deleteButton.svg";
import Eye from "../../../Assets/eye.svg";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // استيراد SweetAlert2

function Ads() {
  const [adTitle, setTitle] = useState("");
  const [adImg, setImage] = useState(null);
  const [AdsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getData = async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/banners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdsData(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [token]);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(AdsData.length / itemsPerPage);

  // استخراج العناصر للصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = AdsData.slice(indexOfFirstItem, indexOfLastItem);

  // التنقل بين الصفحات
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleAdd = async () => {
    if (!adTitle || !adImg) {
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "يرجى ملء جميع الحقول قبل الإرسال",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", adTitle);
    formData.append("image", adImg);

    try {
      const response = await axios.post(
        "https://management.mlmcosmo.com/api/banner",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "نجاح!",
        text: response.data,
      });
      getData();
    } catch (error) {
      console.log(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: error.response.data.message,
      });
    }
  };

  const handelDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن يمكنك التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://management.mlmcosmo.com/api/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire("تم الحذف!", response.data, "success");
            getData();
          })
          .catch((error) => {
            Swal.fire(
              "خطأ!",
              error?.response?.data?.message || "An error occurred",
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <section className="ads-section">
            <div className="container ads-container">
              <div className="row ads-row">
                <div className="col-12 ads-col">
                  <motion.div // استخدام motion.div هنا
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="ads-card shadow"
                  >
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
                  </motion.div>{" "}
                  
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-hover text-center ads-table shadow">
                      <thead>
                        <tr>
                          <th scope="col">الاجرائات</th>
                          <th scope="col">اسم الاعلان</th>
                          <th scope="col">#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length === 0 ? (
                          <>
                            <tr>
                              <td colSpan="4" className="text-center">
                                لا توجد إعلانات متاحة حاليًا
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            {currentItems.map((ad, index) => (
                              <motion.tr // استخدام motion.tr هنا
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 100,
                                  damping: 25,
                                  delay: 0.1 * index,
                                }}
                                key={ad.id}
                              >
                                <td>
                                  <div className="actions">
                                    <img
                                      src={DeleteIcon}
                                      alt="حذف"
                                      onClick={() => {
                                        handelDelete(ad.id);
                                      }}
                                    />
                                    <Link
                                      to={`/dashboard/add-details/${ad.id}`}
                                    >
                                      <img src={Eye} alt="عرض" />
                                    </Link>
                                  </div>
                                </td>
                                <td>{ad.title}</td>
                                <td>{indexOfFirstItem + index + 1}</td>
                              </motion.tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Pagination */}
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
                  السابق
                </button>
                <span className="align-self-center">
                  صفحة {currentPage} من {totalPages}
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
                  التالي
                </button>
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
    </>
  );
}

export default Ads;
