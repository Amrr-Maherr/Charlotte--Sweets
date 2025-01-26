import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import SideBar from "../../Components/SideBar";

function Dashboard() {
  return (
    <>
      <section>
        <div className="container-fluid">
          <div className="row d-flex">
            <div className="col-12">
              <NavBar />
            </div>
            <div className="col-10">
              <Outlet />
            </div>
            <div className="col-2 d-flex justify-content-end p-0">
              <SideBar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
