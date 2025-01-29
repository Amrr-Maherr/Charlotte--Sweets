import "../../Style/ManagerBox.css";

function ManagerBox({ manager, iconColor, iconColor2, bgColor, bgColor2 }) {
  return (
    <div className="manager-box">
      <div className="manager-info">
        <div className="manager-text">
          <p className="manager-value">{manager.sales || 0}</p>
          <p className="manager-label">طلبات الاضافه</p>
        </div>
        <div className="manager-icon-container">
          <i
            className="fa fa-plus-circle manager-icon"
            style={{ color: iconColor, backgroundColor: bgColor }}
          ></i>
        </div>
      </div>
      <div className="manager-info">
        <div className="manager-text">
          <p className="manager-value">{manager.managers || 0}</p>
          <p className="manager-label">مدير جديد</p>
        </div>
        <div className="manager-icon-container">
          <i
            className="fa fa-user-plus manager-icon"
            style={{ color: iconColor2, backgroundColor: bgColor2 }}
          ></i>
        </div>
      </div>
    </div>
  );
}

export default ManagerBox;
