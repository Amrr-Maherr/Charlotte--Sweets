import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import "../../../Style/Products/Products.css";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import AddButton from "../../../Components/AddButton/AddButton";

function Products() {
  const [Data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productBranch, setProductBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // عدد العناصر في الصفحة الواحدة

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data - only on initial mount
  useEffect(() => {
    fetchData();
    fetchBranches();
  }, [token]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [token]);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/branches",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBranches(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const handelAddProduct = () => {
    if (!productName || !productImage || !productBranch) {
      toast.error("يرجى ملء جميع الحقول");
    } else {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("branch_id", productBranch);
      formData.append("image", productImage);

      axios
        .post("https://management.mlmcosmo.com/api/store-product", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data.message);
          toast.success("تمت إضافة المنتج بنجاح");
          fetchData(); // تحديث قائمة المنتجات بعد الإضافة
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "حدث خطأ أثناء إضافة المنتج"
          );
        });
    }
  };

  // Filter products based on search term
  const filteredProducts = Data.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPagesFiltered = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Pagination functions
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPagesFiltered));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Toaster />
      <section>
        <div className="container product-container h-100">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="row product-row">
                <div className="col-xl-4 mt-5">
                  <AddButton
                    ButtonText="اضافه"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="ابحث باسم المنتج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h2 className="text-end" style={{fontSize:"20px"}}>المنتجات</h2>
                </div>
              </div>
              <div className="row product-row">
                {currentItems.length === 0 ? (
                  <div className="fs-2 text-danger text-center">
                    لا توجد منتجات متاحه
                  </div>
                ) : (
                  currentItems.map((product) => (
                    <motion.div
                      className="col-xl-4  col-12 product-col my-5  d-flex justify-content-center"
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="card product-card shadow"
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
                    صفحة {currentPage} من {totalPagesFiltered}
                  </span>
                  <button
                    className="btn mx-2"
                    style={{
                      backgroundColor: "rgba(169, 65, 29, 1)",
                      color: "white",
                    }}
                    onClick={nextPage}
                    disabled={currentPage === totalPagesFiltered}
                  >
                    التالي
                  </button>
                </div>
              </div>
            </>
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
                  <label htmlFor="name" className="form-label text-end">
                    اسم المنتج
                  </label>
                  <input
                    onChange={(event) => {
                      setProductName(event.target.value);
                    }}
                    type="text"
                    id="name"
                    className="form-control text-end"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label text-end">
                    صوره المنتج
                  </label>
                  <input
                    onChange={(event) => {
                      setProductImage(event.target.files[0]);
                    }}
                    type="file"
                    id="address"
                    className="form-control text-end"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label text-end">
                    الفرع
                  </label>
                  <select
                    onChange={(event) => {
                      setProductBranch(event.target.value);
                    }}
                    className="form-control text-end"
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
                      color: "white",
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
