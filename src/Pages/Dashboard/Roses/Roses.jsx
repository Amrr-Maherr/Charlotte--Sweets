import { useEffect, useState } from "react";

function Roses() {
  const [loading, setLoading] = useState(true)
  const [Data,setData] = useState([])
  const token = JSON.parse(localStorage.getItem("AuthToken"))
  useEffect(() => {
    const apiUrl = "https://management.mlmcosmo.com/api/flowers";
  },[token])
    return (
      <>
        <h1>Roses</h1>
      </>
    );
}
export default Roses