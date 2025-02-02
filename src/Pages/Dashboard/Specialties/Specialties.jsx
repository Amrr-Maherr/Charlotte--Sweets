import { useEffect, useState } from "react";

function Specialties() {
   const [loading, setLoading] = useState(true);
   const [Data, setData] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  useEffect(() => {
    const apiUrl = "https://management.mlmcosmo.com/api/specializations";
  },[token])
    return (
      <>
        <h1>Specialties</h1>
      </>
    );
}
export default Specialties