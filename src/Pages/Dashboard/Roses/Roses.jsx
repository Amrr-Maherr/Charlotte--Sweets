import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import deleteButton from "../../../Assets/deleteButton.svg";
import Loader from "../Loader/Loader";
import "../../../Style/Roses/Roses.css";
import AddButton from "../../../Components/AddButton/AddButton";
import { Modal } from "bootstrap";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function Roses() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([]); // State لقائمة الفروع
  const [RoseBranch, setRoseBranch] = useState("");
  const [RoseTitle, setRoseTitle] = useState("");
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this value

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
    fetchBranches(); // جلب قائمة الفروع عند تحميل المكون
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/flowers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/branches",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBranches(response.data);
    } catch (error) {
      console.log("Error fetching branches:", error);
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
          .delete(`https://management.mlmcosmo.com/api/flower/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "تم الحذف!",
              "تم حذف الوردة بنجاح.", // رسالة النجاح
              "success"
            );
            fetchData(); // Refresh data after deletion
          })
          .catch((error) => {
            console.log(error.response.data);
            toast.error("فشل حذف الوردة."); // Show error message
          });
      }
    });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handelAdd = async () => {
    if (!RoseTitle || !RoseBranch) {
      toast.error("الرجاء ملء جميع الحقول."); // استخدام toast لعرض رسالة الخطأ
    } else {
      try {
        const formData = {
          type: RoseTitle,
          branch_id: RoseBranch,
        };
        const response = await axios.post(
          "https://management.mlmcosmo.com/api/store-flower",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        toast.success("تمت إضافة الوردة بنجاح."); // استخدام toast لعرض رسالة النجاح
        fetchData(); // تحديث البيانات بعد الإضافة
        handleCloseModal(); // إغلاق الـ Modal بعد الإضافة
      } catch (error) {
        toast.error(error.response.data.message); // استخدام toast لعرض رسالة الخطأ
      }
    }
  };

  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById("addRoseModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();

        return () => {
          modal.hide();
        };
      }
    }
  }, [showModal]);

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination functions
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Toaster />
      <section>
        <div className="container Roses-container">
          {loading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <div className="row my-3">
                <div className="col-xl-4 mt-5">
                  <AddButton ButtonText="اضافه" onClick={handleShowModal} />
                </div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="ابحث باسم النوع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h1 className="Roses-title text-end">الورود</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-5 Roses-table-col">
                  <table className="table table-hover text-center Roses-table shadow">
                    <thead>
                      <tr>
                        <th scope="col">الإجراءات</th>
                        <th scope="col">الفرع</th>
                        <th scope="col">النوع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="no-data-message">
                            لا توجد بيانات لعرضها
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((ele, index) => (
                          <motion.tr // استخدام motion.tr هنا
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 25,
                              delay: 0.1 * index,
                            }}
                            key={ele.id}
                          >
                            <td className="actions">
                              <div
                                className="delete-icon"
                                onClick={() => {
                                  handelDelete(ele.id);
                                }}
                              >
                                <img
                                  src={deleteButton}
                                  alt="حذف"
                                  className="roses-delete-icon"
                                />
                              </div>
                            </td>
                            <td>{ele.branch.name}</td>
                            <td>{ele.type}</td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
            </>
          )}
        </div>

        {/* Modal */}
        <div
          className={`modal fade`}
          id="addRoseModal"
          tabIndex="-1"
          aria-labelledby="addRoseModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addRoseModalLabel">
                  إضافة وردة جديدة
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Form */}
                <form>
                  <div className="mb-3">
                    <label
                      htmlFor="branchName"
                      className="form-label w-100 text-end"
                    >
                      اسم الفرع
                    </label>
                    <select
                      className="form-select"
                      id="branchName"
                      onChange={(event) => {
                        setRoseBranch(event.target.value);
                      }}
                    >
                      <option value="">اختر الفرع</option>
                      {branches.map((branch) => (
                        <option
                          className="text-end"
                          key={branch.id}
                          value={branch.id}
                        >
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="roseType"
                      className="form-label w-100 text-end"
                    >
                      نوع الورد
                    </label>
                    <input
                      onChange={(event) => {
                        setRoseTitle(event.target.value);
                      }}
                      type="text"
                      className="form-control text-end"
                      id="roseType"
                      placeholder="أدخل نوع الورد"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleCloseModal}
                >
                  إغلاق
                </button>
                <button
                  style={{
                    backgroundColor: "rgba(169, 65, 29, 1)",
                    color: "white",
                  }}
                  type="button"
                  className="btn"
                  onClick={() => {
                    handelAdd();
                  }}
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Roses;
