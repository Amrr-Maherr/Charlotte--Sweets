import axios from "axios";
import { useEffect, useState } from "react";
import "../../../Style/Products/Products.css";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function Products() {
  const [Data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productBranch, setProductBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/branches", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  const handelAddProduct = () => {
    if (!productName || !productImage || !productBranch) {
      toast.error("يرجى ملء جميع الحقول");
    } else {
        const formData = {
            name: productName,
            branch_id: productBranch,
            image:productImage
      }

      axios
        .post("https://management.mlmcosmo.com/api/store-product", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "حدث خطأ أثناء إضافة المنتج"
          );
        });
    }
  };

  return (
    <>
      <section>
        <div className="container product-container h-100">
          {loading ? (
            <Loader />
          ) : (
            <div className="row product-row">
              <div className="col-12 button-col my-5">
                <motion.button
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  className="product-button"
                >
                  اضافه
                </motion.button>
              </div>
              {Data.length === 0 ? (
                <div className="fs-2 text-danger text-center">
                  لا توجد منتجات متاحه
                </div>
              ) : (
                Data.map((product) => (
                  <motion.div
                    className="col-xl-4  col-12 product-col my-3  d-flex justify-content-center"
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="card product-card"
                      style={{ width: "18rem" }}
                    >
                      <img
                        src={product.image || "default-image.jpg"}
                        className="card-img-top"
                        alt={product.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">
                          {product.branch.name || "لا يوجد فرع"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modal for adding product */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        style={{ display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered d-flex justify-content-center">
          <div className="modal-content" style={{ width: "462px" }}>
            <div className="modal-body text-end">
              <div className="form-container">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    اسم المنتج
                  </label>
                  <input
                    onChange={(event) => {
                      setProductName(event.target.value);
                    }}
                    type="text"
                    id="name"
                    className="form-control"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    صوره المنتج
                  </label>
                  <input
                    onChange={(event) => {
                      setProductImage(event.target.files[0]);
                    }}
                    type="file"
                    id="address"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    الفرع
                  </label>
                  <select
                    onChange={(event) => {
                      setProductBranch(event.target.value);
                    }}
                    className="form-control"
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex justify-content-center w-50 mx-auto">
                  <button
                    onClick={() => handelAddProduct()}
                    style={{
                      width: "230px",
                      height: "40px",
                      border: "none",
                      backgroundColor: "#A9411D",
                      borderRadius: "10px",
                    }}
                  >
                    اضافه المنتج
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default Products;
