import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function SalesDetails() {
    const { id } = useParams()
    const [Data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const token = JSON.parse(localStorage.getItem("AuthToken"))
    useEffect(() => {
        axios
          .get(`https://management.mlmcosmo.com/api/sale/${id}`,{headers:{Authorization:`Bearer ${token}`}})
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {});
    },[id,token])
    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            
                        </div>
                    </div>
                </div>
        </section>
        </>
    )
}
export default SalesDetails