import { useState } from "react";
import logo from "../Assets/brand-logo.png";
import "../Style/Login.css"; 
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
function Login() {
  const [Email,setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [loading,setLoading] = useState(false)
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
        .post("/api/login",formData)
        .then((response) => {
          toast.success(response.data);
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
            <div className="col-12 login-col">
              <div className="login-brand-logo">
                <img src={logo} alt="Brand Logo" />
              </div>
            </div>
            <div className="col-12 login-col-form">
              <form className="login-form" onSubmit={(event)=>{handelLogin(event)}}>
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
                <button  className="login-form__button" onClick={(event)=>{handelLogin(event)}}>
                  تسجيل الدخول
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Toaster/>
    </>
  );
}

export default Login;
