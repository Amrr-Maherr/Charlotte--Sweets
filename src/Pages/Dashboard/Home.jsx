import OrderBox from "../../Components/OrderBox"

function Home() {
    return (
      <section>
        <div className="container">
          <div className="row my-5">
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
          <div className="row text-center">
            <div className="col-4">
                    <h1>احصائيات</h1>
            </div>
                    <div className="col-4">
                        احصائيات مديرين
            </div>
                    <div className="col-4">
                        <h1>طلبات الاضافه</h1>
            </div>
          </div>
        </div>
      </section>
    );
}
export default Home