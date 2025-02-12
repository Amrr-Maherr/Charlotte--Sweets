import { Link } from "react-router-dom";
import "../../../Style/NotFound/NotFound.css";
function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry! It seems the page you are looking for is not available.</p>
      <p>
        Return to <Link to="/dashboard/home">Homepage</Link>.
      </p>
    </div>
  );
}
export default NotFound;
