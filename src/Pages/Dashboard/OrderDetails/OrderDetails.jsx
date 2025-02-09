import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function OrderDetails() {
    const { id } = useParams()
    const [Data, setData] = useState({})
    const token = JSON.parse(localStorage.getItem('AuthToken'));
    useEffect(() => {
        axios.get(`https://management.mlmcosmo.com/api/order/${id}`,{headers:{Authorization:`Bearer ${token}`}}).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error.response.data.message);
        })
    },[token,id])
    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">

                            </div>
                        </div>
                    </div>
                </div>
        </section>
        </>
    )
}
export default OrderDetails