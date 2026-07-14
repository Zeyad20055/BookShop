import React, { useEffect, useState } from "react";

function Cart() {

  const [cart, setCart] = useState([]);

  const [payment, setPayment] = useState({
    email: "",
    cardName: "",
    cardNumber: "",
  });



  useEffect(() => {

    const data =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(data);

  }, []);




  const updateCart = (newCart) => {

    setCart(newCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));

  };




  const increaseQuantity = (id) => {

    const newCart = cart.map((item) => {

      if (item._id === id) {

        return {
          ...item,
          quantity: item.quantity + 1,
        };

      }

      return item;

    });


    updateCart(newCart);

  };





  const decreaseQuantity = (id) => {

    const newCart = cart.map((item) => {

      if (item._id === id && item.quantity > 1) {

        return {
          ...item,
          quantity: item.quantity - 1,
        };

      }

      return item;

    });


    updateCart(newCart);

  };





  const removeItem = (id) => {

    const newCart = cart.filter(
      (item) => item._id !== id
    );


    updateCart(newCart);

  };





  const total = cart.reduce(

    (sum, item) =>
      sum + item.price * item.quantity,

    0

  );





  const handleChange = (e) => {

    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });

  };





  return (

    <div className="max-w-5xl mx-auto py-10 px-4">


      <h2 className="text-3xl font-bold mb-6">
        Cart
      </h2>




      {
        cart.length === 0 ? (

          <p className="text-gray-500">
            السلة فارغة
          </p>

        ) : (


          cart.map((item) => (

            <div
              key={item._id}
              className="flex gap-5 border p-4 mb-4 rounded-lg items-center"
            >


              <img
                src={`http://localhost:5000/images/${item.coverImage}`}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />



              <div className="flex-1">

                <h3 className="font-bold text-lg">
                  {item.title}
                </h3>


                <p>
                  Price: ${item.price}
                </p>


                <div className="flex items-center gap-3 mt-3">


                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    -
                  </button>



                  <span className="font-bold">
                    {item.quantity}
                  </span>



                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    +
                  </button>


                </div>


              </div>





              <button

                onClick={() => removeItem(item._id)}

                className="bg-red-600 text-white px-4 py-2 rounded"

              >

                Delete

              </button>



            </div>


          ))

        )
      }






      <div className="border-t pt-5 mt-5">

        <h3 className="text-2xl font-bold">

          Total: ${total}

        </h3>

      </div>







      {/* Payment Information */}

      <div className="mt-10 border rounded-xl p-6 shadow">


        <h2 className="text-2xl font-bold mb-5">
          Payment Information
        </h2>



        <input

          type="email"

          name="email"

          placeholder="Email"

          value={payment.email}

          onChange={handleChange}

          className="w-full border p-3 rounded mb-3"

        />




        <input

          type="text"

          name="cardName"

          placeholder="Card Holder Name"

          value={payment.cardName}

          onChange={handleChange}

          className="w-full border p-3 rounded mb-3"

        />





        <input

          type="text"

          name="cardNumber"

          placeholder="Card Number"

          value={payment.cardNumber}

          onChange={handleChange}

          className="w-full border p-3 rounded mb-3"

        />





        <button

          className="w-full bg-slate-900 text-white py-3 rounded-lg"

        >

          Checkout

        </button>



      </div>



    </div>

  );

}


export default Cart;