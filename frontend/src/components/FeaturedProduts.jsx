import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function FeaturedProduts() {
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/books/getBooks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Books:", data);
        setBookList(data);
      });
  }, []);


  const featuredBooks = bookList.filter(
    (book) => book.isFeatured
  );


  const addToCart = (book) => {

    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];


    const existingBook = cart.find(
      (item) => item._id === book._id
    );


    if (existingBook) {

      existingBook.quantity += 1;

    } else {

      cart.push({
        ...book,
        quantity: 1,
      });

    }


    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );


    // تحديث عداد السلة في Header
    window.dispatchEvent(new Event("cartUpdated"));


    // Alert احترافي
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "تم إضافة الكتاب للسلة 🛒",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

  };


  return (
    <div className="py-10">

      <h2 className="text-2xl font-bold mb-6">
        Featured Products
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {featuredBooks.map((book) => (

          <div
            key={book._id}
            className="border rounded-lg p-4 shadow"
          >

            <img
              src={`http://localhost:5000/images/${book.coverImage}`}
              alt={book.title}
              className="w-full h-48 object-cover"
            />


            <h3 className="mt-3 font-semibold">
              {book.title}
            </h3>


            <p className="text-gray-500">
              {book.author}
            </p>


            <p className="text-[#f86d72]">
              ${book.price}
            </p>


            <button
              onClick={() => addToCart(book)}
              className="mt-3 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition"
            >
              Add To Cart
            </button>


          </div>

        ))}


      </div>

    </div>
  );
}

export default FeaturedProduts;