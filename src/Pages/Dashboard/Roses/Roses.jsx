import axios from "axios";
import { useEffect, useState } from "react";
import deleteButton from "../../../Assets/deleteButton.svg";
import Loader from "../Loader/Loader";
import "../../../Style/Roses/Roses.css";
import AddButton from "../../../Components/AddButton/AddButton";
import { Modal } from "bootstrap";
import toast, { Toaster } from "react-hot-toast";

function Roses() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([]); // State لقائمة الفروع
  const [RoseBranch, setRoseBranch] = useState("");
  const [RoseTitle, setRoseTitle] = useState("");
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    fetchData();
    fetchBranches(); // جلب قائمة الفروع عند تحميل المكون
  }, [token]);

  const fetchData = async () => {
    try {
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
    axios
      .delete(`https://management.mlmcosmo.com/api/flower/${id}`)
      .then((response) => {
        console.log(response.data);
        fetchData();
      })
      .catch((error) => {
        console.log(error.response.data);
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
              <div className="row">
                <div className="col-12 mt-5 Roses-col d-flex align-items-center justify-content-between">
                  <AddButton ButtonText="اضافه" onClick={handleShowModal} />
                  <h1 className="Roses-title">الورود</h1>
                </div>
                <div className="col-12 mt-5 Roses-table-col">
                  <table className="table table-hover text-center Roses-table">
                    <thead>
                      <tr>
                        <th scope="col">الإجراءات</th>
                        <th scope="col">الفرع</th>
                        <th scope="col">النوع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="no-data-message">
                            لا توجد بيانات لعرضها
                          </td>
                        </tr>
                      ) : (
                        data.map((ele) => (
                          <tr key={ele.id}>
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
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
                    <label htmlFor="branchName" className="form-label">
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
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roseType" className="form-label">
                      نوع الورد
                    </label>
                    <input
                      onChange={(event) => {
                        setRoseTitle(event.target.value);
                      }}
                      type="text"
                      className="form-control"
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
                  type="button"
                  className="btn btn-primary"
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
