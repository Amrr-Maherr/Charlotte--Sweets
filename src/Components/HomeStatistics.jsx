import StatisticsList from "./StatisticsList/StatisticsList"

function HomeStatistics() {
    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-4 col-12">
                            <StatisticsList/>
                        </div>
                        <div className="col-xl-4 col-12">
                            <StatisticsList/>
                        </div>
                        <div className="col-xl-4 col-12">
                            <StatisticsList/>
                        </div>
                    </div>
                </div>
        </section>
        </>
    )
}
export default HomeStatistics