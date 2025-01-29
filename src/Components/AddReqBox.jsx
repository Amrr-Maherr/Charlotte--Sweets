import React from "react";
import "../Style/AddReqBox.css"
function AddReqBox({ managers, sales }) {
  const handleAccept = (name, type) => {
    console.log(`Accepted ${type}: ${name}`);
  };

  const handleReject = (name, type) => {
    console.log(`Rejected ${type}: ${name}`);
  };

  return (
    <>
      <div className="request-box">
        <div className="request-content">
          {/* عرض المديرين */}
          <div className="managers-section">
            {managers && managers.length > 0 ? (
              managers.map((manager) => (
                <div key={manager.id} className="manager-card">
                  <div className="manager-actions">
                    <button
                      className="accept-button"
                      onClick={() => handleAccept(manager.name, "Manager")}
                    >
                      قبول
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(manager.name, "Manager")}
                    >
                      رفض
                    </button>
                  </div>
                  <div className="manager-info">
                    <p className="manager-name">{manager.first_name}</p>{" "}
                    {/* اسم المدير */}
                    <p className="manager-position">{manager.position}</p>{" "}
                    {/* وظيفة المدير */}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-managers">No managers available</p>
            )}
          </div>

          {/* عرض السيلز */}
          <div className="-sectionsales">
            {sales && sales.length > 0 ? (
              sales.map((sale) => (
                <div key={sale.id} className="sale-card">
                  <div className="sale-info">
                    <p className="sale-name">{sale.first_name}</p>{" "}
                    {/* اسم السيلز */}
                    <p className="sale-position">{sale.key}</p>{" "}
                    {/* وظيفة السيلز */}
                  </div>
                  <div className="sale-actions">
                    <button
                      className="accept-button"
                      onClick={() => handleAccept(sale.first_name, "Sale")}
                    >
                      قبول
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(sale.first_name, "Sale")}
                    >
                      رفض
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-sales">No sales available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddReqBox;
