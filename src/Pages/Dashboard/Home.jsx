import React from "react";
import OrderBox from "../../Components/OrderBox";
import Chart from "../../Pages/Dashboard/Chart";

function Home() {
  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 100 },
    { name: "Group F", value: 100 },
  ];
  return (
    <section>
      <div className="container">
        <div className="row my-5 text-center  d-flex align-items-center justify-content-center">
          <div className="col-xl-3 my-3">
            <OrderBox />
          </div>
          <div className="col-xl-3 my-3">
            <OrderBox />
          </div>
          <div className="col-xl-3 my-3">
            <OrderBox />
          </div>
          <div className="col-xl-3 my-3">
            <OrderBox />
          </div>
          <div className="col-xl-3 my-3">
            <OrderBox />
          </div>
          <div className="col-xl-3 my-3">
            <OrderBox />
          </div>
          <div className="col-xl-3 my-3">
            <OrderBox />
          </div>
        </div>
        <div className="row text-center  d-flex align-center justify-content-between">
          <div className="col-4">احصائيات مديرين</div>
          <div className="col-4">
            <Chart data={data} />
          </div>
          <div className="col-4">
            <h1>طلبات الاضافه</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Home;
