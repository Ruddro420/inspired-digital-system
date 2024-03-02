import { useEffect, useState } from "react";
import Error from "../components/Error";

const Home = () => {
  const [data, setData] = useState([]);
  // fetch data
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  useEffect(() => {
    fetch(`${BASE_URL}/api/view/services` ,{
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
    },
    })
      .then((res) => res.json())
      .then((data) => setData(data.info));
  }, [API_KEY, BASE_URL]);

  //const navigate = useNavigate()
  // service handler
  /* const serviceHandler = (title) => {
        navigate(`/home/${title}`);
    } */
  return (
    <>
      <div className="home-container">
        <div className=" mb-8 py-[10px] text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-black">
            আমাদের সার্ভিস সমূহ
          </h2>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:space-y-0">
          {data ? (
            data.map((service, index) => (
              <div
                /* onClick={() => serviceHandler(service.title)} */ /* to={service.src} */ key={
                  index
                }
                className="card w-96 bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <h2 className="card-title">
                    {service.name}
                    <div className="badge badge-secondary">NEW</div>
                  </h2>
                  {/* <p>{service.des}</p> */}
                  <div className="card-actions justify-start">
                    <div className="badge badge-outline">
                      সর্বনিম্ন {service.min}
                    </div>
                    <div className="badge badge-outline">
                      সর্বোচ্চ {service.max}{" "}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Error data='No Service Available' />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
