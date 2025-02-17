import { useState } from "react";
import logo from "../../../Assets/brand-logo.png";
import "../../../Style/Login.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    if (!Email || !Password) {
      toast.error("Please fill in all fields.");
    } else {
      const formData = {
        email: Email,
        password: Password,
      };
      axios
        .post("https://management.mlmcosmo.com/api/login", formData)
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem("AuthToken", JSON.stringify(token));
          toast.success("Login successful");
          setEmail("");
          setPassword("");
          navigate("/dashboard/home");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

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
              <div className="login-brand-logo d-none d-xl-block ms-auto">
                <img src={logo} alt="Brand Logo" />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: "100vh" }}
              animate={{ x: 0 }}
              transition={{ duration: 1 }}
              className="col-12 login-col-form"
            >
              <form className="login-form" onSubmit={handleLogin}>
                <div className="login-form__header  w-100 ">
                  <div className="login-form__logo">
                    <h1 className="login-form__welcome-text fs-1 fs-md-3 fs-sm-4 me-auto">
                      Welcome to
                    </h1>
                    <img
                      src={logo}
                      alt="Brand Logo"
                      className="login-form__logo-image"
                    />
                  </div>
                  <h3 className="login-form__login-text fs-2 fs-md-3 fs-sm-4 text-start">
                    Login
                  </h3>
                </div>
                <div className="login-form__group">
                  <label
                    htmlFor="email"
                    className="login-form__label text-start d-block"
                  >
                    Email Address
                  </label>
                  <input
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    placeholder="Enter your email"
                    type="email"
                    className="login-form__input text-start px-3"
                    id="email"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="login-form__group">
                  <label
                    htmlFor="password"
                    className="login-form__label  text-start d-block"
                  >
                    Password
                  </label>
                  <input
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    placeholder="Enter your password"
                    type="password"
                    className="login-form__input text-start px-3"
                    id="password"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  className="login-form__button me-auto"
                  onClick={handleLogin}
                >
                  Login
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
