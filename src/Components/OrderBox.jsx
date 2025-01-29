import "../Style/OrderBox.css";

function OrderBox({ title, count, iconColor,icon }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-text">
          <p className="card-num">{count}</p>
          <p className="card-num-text">{title}</p>
        </div>
        <i
          className={`fa ${icon} fa-lg me-3`}
          style={{ backgroundColor: iconColor}}
        ></i>
      </div>
    </div>
  );
}

export default OrderBox;
