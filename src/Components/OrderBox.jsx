import "../Style/OrderBox.css";

function OrderBox() {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="card-text">
            <p className="card-num">8</p>
            <p className="card-num-text">طلبات جديده</p>
          </div>
          <i className="fa fa-shopping-cart fa-lg me-3"></i>
        </div>
      </div>
    </>
  );
}

export default OrderBox;
