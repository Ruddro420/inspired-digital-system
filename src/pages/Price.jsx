import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";

const Price = () => {
  const [data, setData] = useState([]);
  // fetch data
   // fetch data
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  useEffect(() => {
    fetch(`${BASE_URL}/api/view/price`,{
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
    },
    })
      .then((res) => res.json())
      .then((data) => setData(data.info));
  }, [API_KEY, BASE_URL]);

  const navigate = useNavigate();

  // price handler
  const priceHandler = (id) => {
    navigate(`/home/price/${id}`);

    /*  if (data == "ব্যাসিক") {
      navigate("/home/basic");
    } else if (data == "কোম্পানি") {
      navigate("/home/company");
    } else if (data == "এন্টারপ্রাইজ") {
      navigate("/home/enterprise");
    } */
  };
  return (
    <>
      <div className="price-container">
        <div className="py-[10px] text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-black">
            আমাদের প্রাইজ পয়েন্ট
          </h2>
        </div>
        <div className="w-full px-4 bg-white mb-15">
          <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
            {data ? (
              data.map((card, index) => (
                <div
                  key={index}
                  className={`w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300 border`}
                >
                  <h2 className="text-2xl font-bold text-center py-8">
                    {card.name}
                  </h2>
                  <p className="text-center text-4xl font-bold">
                    {card.price}/<sub>{card.time}</sub>
                  </p>
                  <button
                    onClick={() => priceHandler(card.id)}
                    className={`bg-[#FF00D3] hover:text-[#00df9a] hover:bg-gray-50 duration-150 w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3 text-white`}
                  >
                    Start Trial
                  </button>
                </div>
              ))
            ) : (
              <Error data="No Package Available" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Price;
