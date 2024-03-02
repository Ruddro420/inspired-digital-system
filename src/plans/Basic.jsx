/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

const Basic = () => {
  const { id } = useParams();

  const [priceData, setPriceData] = useState([]);
  const [packageName, setPackageName] = useState("");
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [showPlan, setShowPlan] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState(1);

  // Fetch data
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch price data for the specific package
        const priceResponse = await axios.get(
          `${BASE_URL}/api/get/allPriceModel/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": API_KEY,
            },
          }
        );
        setPriceData(priceResponse.data.info);

        // Set package name if data is available
        if (
          priceResponse.data.info &&
          priceResponse.data.info[id] &&
          priceResponse.data.info[id].length > 0 &&
          priceResponse.data.info[id][0].package
        ) {
          setPackageName(priceResponse.data.info[id][0].package.name);
          document.title = `${packageName} Plan`;
        }

        // Fetch plan data
        const planResponse = await axios.get(`${BASE_URL}/api/view/plan`,{
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
        },
        });
        setShowPlan(planResponse.data.info);

        // Select the first plan by default
        if (planResponse.data.info && planResponse.data.info.length > 0) {
          setSelectedPlan(planResponse.data.info[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [API_KEY, BASE_URL, id, packageName]);

  useEffect(() => {
    if (priceData && Array.isArray(priceData[id])) {
      let totalCount = 0;
      priceData[id].forEach((item) => {
        // Only consider items belonging to the selected plan
        if (item.plan.id === parseInt(selectedPlan)) {
          totalCount += parseInt(item.price);
        }
      });
      setTotal(totalCount * selectedMonths); // Multiply by selected months
    }
  }, [id, priceData, selectedPlan, selectedMonths]);

  // discount here
  const discountHandler = () => {
    if (discount == "") {
      alert("Please enter discount code");
    } else {
      setTotal((prevTotal) => {
        const discountedTotal = prevTotal - (discount / 100) * prevTotal;
        return discountedTotal < 0 ? 0 : discountedTotal;
      });
      setDiscount("");
    }
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonths(parseInt(e.target.value));
  };

  // boook order
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [sName, setSName] = useState("");
  const [location, setLocation] = useState("");
  const [payment, setPayment] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [eName, setEName] = useState("");

  // custom order
  const handleBookNow = () => {
    // Create bookingData object with selected options
    const bookingData = {
      package: id,
      plan: selectedPlan,
      month: selectedMonths,
      total: total,
      order_date: orderDate,
      customer_name: cName,
      customer_phone: cPhone,
      shop_name: sName,
      location: location,
      payment: payment,
      employee_name: eName,
    };

    // Send a POST request to your backend API
    axios
      .post(`${BASE_URL}/api/add/packageOrder`, bookingData, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
      })
      .then((response) => {
        toast.success("Booking successful!");
        setOrderDate("");
        setCName("");
        setCPhone("");
        setSName("");
        setLocation("");
        setPayment("");
        setEName("");
      })
      .catch((error) => {
        console.error("Error booking:", error);
        toast.error("Booking failed. Please try again later.");
      });
  };

  return (
    <>
      <Toaster />
      <div className="price-container">
        <div className="py-[10px] text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-black">
            Choose a {packageName} Plan
          </h2>
        </div>
        <div className="flex justify-center mb-4">
          <select
            value={selectedPlan}
            onChange={handlePlanChange}
            className="select select-secondary w-full max-w-xs m-3"
          >
            {showPlan.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
          <select
            value={selectedMonths}
            onChange={handleMonthChange}
            className="select select-secondary w-full max-w-xs m-3"
          >
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <option key={month} value={month}>
                {month} Month(s)
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {priceData && Array.isArray(priceData[id])
            ? priceData[id]
                .filter((item) => item.plan.id === parseInt(selectedPlan))
                .map((item, index) => (
                  <div
                    key={index}
                    className="card bg-base-100 shadow-xl border"
                  >
                    <div className="card-body w-100">
                      <h2 className="card-title">
                        {item.name}
                        <div className="badge badge-secondary">
                          {item.quantity * selectedMonths}
                        </div>
                      </h2>
                    </div>
                  </div>
                ))
            : ""}
        </div>
        {/* Total Costing */}
        <div role="alert" className="alert alert-info shadow-lg mt-10 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2>
            <button className="btn btn-sm btn-danger">
              Total Cost : ৳ {total}{" "}
            </button>
          </h2>
          {total !== 0 ? (
            <button
              onClick={() => document.getElementById("my_modal_1").showModal()}
              className="btn btn-sm btn-danger"
            >
              Get Verified
            </button>
          ) : (
            ""
          )}
        </div>
        {/* Discount Costing */}
        <div role="alert" className="alert alert-info shadow-lg mt-10 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2>
            <input
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              type="number"
              placeholder="Discount Here"
              className="input input-sm  ml-5 max-w-xs"
            />
            <button
              onClick={discountHandler}
              className="btn btn-sm btn-danger ml-5"
            >
              Apply Discount
            </button>
          </h2>
        </div>
      </div>
      <br />
      <br /> <br />
      <br />
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
                <option selected>Select Payment Option</option>
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

export default Basic;
