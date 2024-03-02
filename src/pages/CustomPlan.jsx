import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Error from "../components/Error";

const CustomPlan = () => {
  const [data, setData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [total, setTotal] = useState(0);
  const [priceMap, setPriceMap] = useState({}); // Define priceMap state

  // fetch data
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  useEffect(() => {
    fetch(`${BASE_URL}/api/view/services`,{
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
    },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.info);

        // Create priceMap based on item minimum values
        const map = {};
        data.info.forEach((item) => {
          map[item.id] = parseInt(item.min);
        });
        setPriceMap(map);
      });
  }, [API_KEY, BASE_URL]);

  const handleButtonClick = (planId, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [planId]: option,
    }));
  };

  const generateHandler = () => {
    let totalCount = 0;
    Object.entries(selectedOptions).forEach(([planId, option]) => {
      const price = priceMap[planId] * option;
      if (price) {
        totalCount += price;
      }
    });
    setTotal(totalCount);
  };

  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [sName, setSName] = useState("");
  const [location, setLocation] = useState("");
  const [payment, setPayment] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [eName, setEName] = useState("");

  // custom order
  const handleBookNow = () => {
    // Construct selected_options object
    const selectedOptionsData = {};
    Object.entries(selectedOptions).forEach(([planId, option]) => {
      const selectedItem = data.find((item) => item.id == planId);
      // Check if the selected item exists and has a valid name
      if (selectedItem && selectedItem.name) {
        selectedOptionsData[selectedItem.name] = option;
      }
    });

    // Create bookingData object with selected options
    const bookingData = {
      selected_options: selectedOptionsData,
      total: total,
      order_date: orderDate,
      customer_name: cName,
      customer_phone: cPhone,
      shop_name: sName,
      location: location,
      payment: payment,
      employee_name: eName,
    };

    // Send bookingData to the server
    axios
      .post(`${BASE_URL}/api/add/customOrder`, bookingData,{
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
      },
      })
      .then((response) => {
        if (response.data.status === 200) {
          toast.success("Order created successfully!");
          // Reset all input fields and state variables
          setSelectedOptions({});
          setTotal(0);
          setOrderDate("");
          setCName("");
          setCPhone("");
          setSName("");
          setLocation("");
          setPayment("");
          setEName("");
        } else {
          toast.error("Failed to create order. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        toast.error("Failed to create order. Please try again later.");
      });
  };

  return (
    <>
      <div className="py-[10px] text-center">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-black">
          Customize Your Plan
        </h2>
      </div>
      {data ? (
        <section className="custom-price-container">
          <div className="price-container">
            <div>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => (
                      <tr key={i}>
                        <th></th>
                        <td>{item.name}</td>
                        <td>
                          {item.options.split(",").map((option, index) => (
                            <button
                              key={index}
                              className={`btn btn-outline btn-sm btn-secondary m-1 ${
                                selectedOptions[item.id] === option
                                  ? "active-color"
                                  : ""
                              }`}
                              onClick={() => handleButtonClick(item.id, option)}
                            >
                              {option.trim()}
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="selected-options-container mt-8 border shadow-sm p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Selected Options:</h3>
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedOptions).map(
                  ([planId, option], index) => {
                    const selectedItem = data.find((item) => item.id == planId);
                    const price = priceMap[planId] * option;
                    return (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          {selectedItem?.name}
                        </td>
                        <td className="border px-4 py-2">{option}</td>
                        <td className="border px-4 py-2">{price} Taka</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>

            <div role="alert" className="alert shadow-lg mt-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <button
                  onClick={generateHandler}
                  className="btn btn-sm btn-primary mr-5"
                >
                  Generate
                </button>
                <button className="btn btn-sm btn-info">৳ {total} Taka</button>
              </div>
              {total !== 0 ? (
                <button
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                  className="btn btn-sm btn-success"
                >
                  Get Verified
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      ) : (
        <Error data="No Custom Plan Found"/>
      )}
      <Toaster />
      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Please Insert Below</h3>
          <p className="py-4">
            <div>
              <label className="input input-bordered flex items-center gap-2">
                Customer Name:
                <input
                  type="text"
                  className="grow"
                  placeholder="Hello Ali"
                  onChange={(e) => setCName(e.target.value)}
                  required
                  value={cName}
                />
              </label>
            </div>
            <div className="mt-3">
              <label className="input input-bordered flex items-center gap-2">
                Customer Phone:
                <input
                  type="number"
                  className="grow"
                  placeholder="014785624"
                  onChange={(e) => setCPhone(e.target.value)}
                  required
                  value={cPhone}
                />
              </label>
            </div>
            <div className="mt-3">
              <label className="input input-bordered flex items-center gap-2">
                Shop Name:
                <input
                  type="text"
                  className="grow"
                  placeholder="Marvel Store"
                  onChange={(e) => setSName(e.target.value)}
                  required
                  value={sName}
                />
              </label>
            </div>
            <div className="mt-3">
              <label className="input input-bordered flex items-center gap-2">
                Location:
                <input
                  type="text"
                  className="grow"
                  placeholder="Boro Bazar , Rangpur"
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  value={location}
                />
              </label>
            </div>
            <div className="mt-2">
              <select
                className="select select-ghost w-full select-bordered"
                onChange={(e) => setPayment(e.target.value)}
                required
                value={payment}
              >
                <option selected>
                  Select Payment Option
                </option>
                <option value="complete">Complete</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="mt-3">
              <label className="input input-bordered flex items-center gap-2">
                Order Date:
                <input
                  type="date"
                  className="grow"
                  onChange={(e) => setOrderDate(e.target.value)}
                  required
                  value={orderDate}
                />
              </label>
            </div>
            <div className="mt-3">
              <label className="input input-bordered flex items-center gap-2">
                Employee Name:
                <input
                  type="text"
                  className="grow"
                  placeholder="Ali Amir"
                  onChange={(e) => setEName(e.target.value)}
                  required
                  value={eName}
                />
              </label>
            </div>
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={handleBookNow}
                className="btn btn-sm btn-primary mr-6"
              >
                Book Order
              </button>
              <button className="btn btn-sm btn-accent">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CustomPlan;
