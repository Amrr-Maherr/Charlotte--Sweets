import logo_image from "../Assets/brand-logo.png";
import profile_image from "../Assets/profile-image.png";
import "../Style/NavBar.css";

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
        <div className="container-fluid">
          <a className="navbar-brand profile-image" href="#">
            <img src={profile_image} alt="Profile" />
          </a>
          <div
            className="collapse  navbar-collapse"
            id="navbarSupportedContent"
          >
            {/* <ul className="navbar-nav">
              <li className="nav-item search-box">
                <div className="search-container">
                  <input
                    className="form-control search me-2"
                    type="search"
                    placeholder="ابحث"
                    aria-label="Search"
                  />
                  <i className="fa fa-search search-icon"></i>
                </div>
              </li>
            </ul> */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link dashboard-link" aria-disabled="true">
                  لوحه التحكم
                </a>
              </li>
            </ul>
          </div>
          <ul className="navbar-nav logo-image">
            <li className="nav-item">
              <img src={logo_image} alt="Logo" />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
