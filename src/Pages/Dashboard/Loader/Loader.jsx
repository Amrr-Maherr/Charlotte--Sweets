import { BounceLoader } from "react-spinners";

function Loader() {
  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 vh-100 d-flex align-items-center justify-content-center">
              <BounceLoader color={"#CBDEE4A8"} size={"200px"} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Loader;
