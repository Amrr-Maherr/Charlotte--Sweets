import { useState } from "react";
import logo from "../../../Assets/brand-logo.png"
import "../../../Style/Login.css"; 
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  const [Email,setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const Navigate = useNavigate()
  const handelLogin = (event) => {
    event.preventDefault();
    if (!Email || !Password) {
      toast.error("يرجي ملئ جميع الحقول.");
    } else {
      const formData = {
        email: Email,
        password:Password
      }
      axios
        .post("https://management.mlmcosmo.com/api/login", formData)
        .then((response) => {
          const token = response.data.token
          localStorage.setItem("AuthToken",JSON.stringify(token))
          toast.success("Login success");
          setEmail("");
          setPassword("");
          setTimeout(Navigate("/dashboard/home"), 3000);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }
  return (
    <>
      <section className="login-section">
        <div className="container">
          <div className="row login-row">
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
              className="col-12 login-col"
            >
              <div className="login-brand-logo d-none d-xl-block">
                <img src={logo} alt="Brand Logo" />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: "100vh" }}
              animate={{ x: 0 }}
              transition={{ duration: 1 }}
              className="col-12 login-col-form"
            >
              <form
                className="login-form"
                onSubmit={(event) => {
                  handelLogin(event);
                }}
              >
                <div className="login-form__header">
                  <div className="login-form__logo">
                    <img
                      src={logo}
                      alt="Brand Logo"
                      className="login-form__logo-image"
                    />
                    <h1 className="login-form__welcome-text fs-1 fs-md-3 fs-sm-4">
                      اهلا بك في
                    </h1>
                  </div>
                  <h3 className="login-form__login-text fs-2 fs-md-3 fs-sm-4">
                    تسجيل الدخول
                  </h3>
                </div>
                <div className="login-form__group">
                  <label htmlFor="email" className="login-form__label">
                    البريد الإلكتروني
                  </label>
                  <input
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    placeholder="ادخل بريدك الالكتروني"
                    type="email"
                    className="login-form__input"
                    id="email"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="login-form__group">
                  <label htmlFor="password" className="login-form__label">
                    كلمة المرور
                  </label>
                  <input
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    placeholder="ادخل كلمه السر"
                    type="password"
                    className="login-form__input"
                    id="password"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  className="login-form__button"
                  onClick={(event) => {
                    handelLogin(event);
                  }}
                >
                  تسجيل الدخول
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      <Toaster />
    </>
  );
}

export default Login;
