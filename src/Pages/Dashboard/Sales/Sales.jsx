import "../../../Style/Sales/Sales.css";

function Sales() {
  // بيانات تجريبية
  const salesData = [
    {
      id: 1,
      status: "مقبول",
      branch: "حي الجامعة",
      value: "1500 جنيه",
      date: "2024-01-15",
      name: "محمد علي",
      orderNumber: "#001",
    },
    {
      id: 2,
      status: "قيد التنفيذ",
      branch: "حي النصر",
      value: "2200 جنيه",
      date: "2024-01-16",
      name: "أحمد حسن",
      orderNumber: "#002",
    },
    {
      id: 3,
      status: "مرفوض",
      branch: "وسط البلد",
      value: "1800 جنيه",
      date: "2024-01-17",
      name: "سارة محمود",
      orderNumber: "#003",
    },
    {
      id: 4,
      status: "مقبول",
      branch: "المعادي",
      value: "3000 جنيه",
      date: "2024-01-18",
      name: "خالد إبراهيم",
      orderNumber: "#004",
    },
  ];

  return (
    <>
      <section>
        <div className="container Sales-table-container">
          <div className="row Sales-table-row">
            <div className="col-12 Sales-table-title-col">
              <h2 className="Sales-table-title">قائمة المبيعات</h2>
            </div>
            <div className="col-12 Sales-table-col">
              <table className="table Sales-table table-hover">
                <thead>
                  <tr>
                    <th scope="col">حالة الطلب</th>
                    <th scope="col">الفرع</th>
                    <th scope="col">قيمة الطلب</th>
                    <th scope="col">تاريخ الطلب</th>
                    <th scope="col">الاسم</th>
                    <th scope="col">رقم الطلب</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.status}</td>
                      <td>{sale.branch}</td>
                      <td>{sale.value}</td>
                      <td>{sale.date}</td>
                      <td>{sale.name}</td>
                      <td>{sale.orderNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Sales;
