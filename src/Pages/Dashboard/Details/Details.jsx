import "../../../Style/Details/Details.css";

function Details() {
  // بيانات المدير التجريبية
 const manager = {
   image: "https://i.pravatar.cc/150?img=12", // صورة اعتبارية للمدير
   name: "أحمد سالم",
   position: "مدير الفرع الرئيسي",
   email: "ahmed.salem@example.com",
   phone: "+201234567890",
   branch: "الفرع الرئيسي",
   status: "مقبول", // حالة الطلب (مقبول أو مرفوض)
   dateAdded: "2025-01-30", // تاريخ الإضافة
 };

  return (
    <>
      <section>
        <div className="container Details-container">
          <div className="row Details-row">
            <div className="col-12 Details-col">
              <div className="card text-center">
                <div className="card-title">
                  <h3>تفاصيل المدير</h3>
                </div>
                <img
                  src={manager.image}
                  className="card-img-top"
                  alt={manager.name}
                  style={{
                    width: "81px",
                    height: "81px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    margin: "0px auto",
                  }}
                />
                <div className="card-body">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>{manager.name}</td>
                        <th>الاسم</th>
                      </tr>
                      <tr>
                        <td>{manager.position}</td>
                        <th>الوظيفة</th>
                      </tr>
                      <tr>
                        <td>{manager.email}</td>
                        <th>البريد الإلكتروني</th>
                      </tr>
                      <tr>
                        <td>{manager.phone}</td>
                        <th>رقم الهاتف</th>
                      </tr>
                      <tr>
                        <td>{manager.branch}</td>
                        <th>الفرع</th>
                      </tr>
                      <tr>
                        <td>{manager.status}</td>
                        <th>حالة الطلب</th>
                      </tr>
                      <tr>
                        <td>{manager.dateAdded}</td>
                        <th>تاريخ الإضافة</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Details;
