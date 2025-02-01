import { Link } from "react-router-dom";
import "../../../Style/NotFound/NotFound.css"
function NotFound() {
    return (
      <div className="not-found-container">
        <h1>404 - الصفحة غير موجودة</h1>
        <p>عذرًا! يبدو أن الصفحة التي تبحث عنها غير متوفرة.</p>
        <p>
          العودة إلى <Link to="/dashboard/home">الصفحة الرئيسية</Link>.
        </p>
      </div>
    );
}
export default NotFound 