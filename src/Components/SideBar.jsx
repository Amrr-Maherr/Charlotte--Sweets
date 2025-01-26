import "../Style/SideBar.css";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <>
      <aside>
        <ul>
          <li>
            <Link to="/dashboard/home">
              <i className="fa fa-home"></i> الرئيسيه
            </Link>
          </li>
          <li>
            <Link to="/dashboard/branches">
              <i className="fa fa-code-fork"></i> الفروع
            </Link>
          </li>
          <li>
            <Link to="/dashboard/managers">
              <i className="fa fa-users"></i> المديرين
            </Link>
          </li>
          <li>
            <Link to="/dashboard/chefs">
              <i className="fa fa-cutlery"></i> الشيفات
            </Link>
          </li>
          <li>
            <Link to="/dashboard/sales-representatives">
              <i className="fa fa-truck"></i> مناديب المبيعات
            </Link>
          </li>
          <li>
            <Link to="/dashboard/sales">
              <i className="fa fa-line-chart"></i> السيلز
            </Link>
          </li>
          <li>
            <Link to="/dashboard/ads">
              <i className="fa fa-bullhorn"></i> الاعلانات
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default SideBar;
