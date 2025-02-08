import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "../../../../Style/AdDetails/AdDetails.css"
import Loader from "../../Loader/Loader"
function AdDetails() {
    const { id } = useParams()
    const token = JSON.parse(localStorage.getItem("AuthToken"))
    const [Data, setData] = useState([])
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        axios
          .get(`https://management.mlmcosmo.com/api/banner/${id}`,{headers:{Authorization:`Bearer ${token}`}})
            .then((response) => {
              console.log(response.data);
                setData(response.data)
                setLoading(false)
          })
            .catch((error) => {
              console.log(error.response.data.message);
              setLoading(true)
          });
    },[token,id])
    return (
      <>
        <section>
          {loading ? (
            <><Loader/></>
          ) : (
            <>
              <div className="container single-add-container">
                <div className="row single-add-row">
                  <div className="col-12 single-add-col">
                    <div className="single-add-card">
                      {Data.map((ad) => (
                        <>
                          <div className="single-add-image">
                            <img src={ad.image} alt="" />
                          </div>
                          <div className="single-add-title m-1">
                            <p>{ad.title}</p>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </>
    );
}
export default AdDetails