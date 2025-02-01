import React from "react";
import "../../../Style/SalesRepresentatives/SalesRepresentatives.css"
import { Link } from "react-router-dom";
function SalesRepresentatives() {
  const salesRepsData = [
    {
      id: 1,
      name: "محمد علي",
      phone: "0551234567",
      email: "mohammed.ali@example.com",
      totalDeliveries: 150,
    },
    {
      id: 2,
      name: "أحمد سعيد",
      phone: "0509876543",
      email: "ahmed.saeed@example.com",
      totalDeliveries: 200,
    },
    {
      id: 3,
      name: "سارة خالد",
      phone: "0534567890",
      email: "sara.khaled@example.com",
      totalDeliveries: 100,
    },
    {
      id: 4,
      name: "ليلى عبدالله",
      phone: "0567890123",
      email: "layla.abdullah@example.com",
      totalDeliveries: 120,
    },
  ];

  return (
    <>
      <section className="sales-representatives-section">
        <div className="container sales-reps-table-container">
          <div className="row sales-reps-table-row">
            <div className="col-12 sales-reps-table-col mt-5">
              <table className="table sales-reps-table  table-hover">
                <thead>
                  <tr>
                    <th scope="col">الاجراءات</th>
                    <th scope="col">اجمالى التوصيلات</th>
                    <th scope="col">البريد الالكتروني</th>
                    <th scope="col">الجوال</th>
                    <th scope="col">الاسم</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRepsData.map((rep) => (
                    <tr key={rep.id} className="sales-reps-table-row">
                      <th scope="row">{rep.id}</th>
                      <td>{rep.totalDeliveries}</td>
                      <td>{rep.email}</td>
                      <td>{rep.phone}</td>
                      <td>
                        <Link>{rep.name}</Link>
                      </td>
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

export default SalesRepresentatives;
