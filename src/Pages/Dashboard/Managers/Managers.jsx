import "../../../Style/Managers.jsx/Managers.css"
function Managers() {
  return (
    <>
      <section>
        <div className="container Managers-table-container">
          <div className="row Managers-table-row">
            <div className="col-12 Managers-table-col">
              <table class="table Managers-table  table-hover">
                <thead>
                  <tr>
                    <th scope="col">الاجراءات</th>
                    <th scope="col">حاله المدير</th>
                    <th scope="col">الفرع</th>
                    <th scope="col">الاسم</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>مقبول</td>
                    <td>حى الجامعه</td>
                    <td>محمد على</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>مقبول</td>
                    <td>حى الجامعه</td>
                    <td>محمد على</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>مقبول</td>
                    <td>حى الجامعه</td>
                    <td>محمد على</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Managers;
