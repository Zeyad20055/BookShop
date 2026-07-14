import React, { useEffect, useState } from "react";
import logo from "../logo.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ShoppingCart } from "lucide-react";

const Header = () => {

  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();

  const navigate = useNavigate();


  const [cartCount, setCartCount] = useState(0);


  // تحديث عدد المنتجات في السلة
  useEffect(() => {

    const updateCartCount = () => {

      const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


      const total = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );


      setCartCount(total);

    };


    updateCartCount();


    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );


    return () => {

      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

    };


  }, []);



  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
    { name: "Contact", path: "/" },
    { name: "About", path: "/" },
  ];


  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, []);




  return (

    <nav
      className={`fixed top-0 left-0 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 transition-all duration-500 z-50 ${
        isScrolled ? "shadow-md py-3" : "py-4 lg:py-5"
      }`}
    >


      {/* Logo */}

      <button
        onClick={() => navigate("/")}
        className="flex items-center"
      >

        <img
          src={logo}
          alt="logo"
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded-full"
        />

      </button>





      {/* Desktop Nav */}

      <div className="hidden lg:flex items-center gap-6 xl:gap-10">

        {navLinks.map((link, i) => (

          <button
            key={i}
            onClick={() => navigate(link.path)}
            className="group relative text-[15px] font-medium text-black hover:text-red-600 transition"
          >

            {link.name}

            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></span>

          </button>

        ))}

      </div>






      {/* Desktop Right */}

      <div className="hidden lg:flex items-center gap-4">


        {!loading && !isAuthenticated ? (

          <>

            <button
              onClick={() => navigate("/login")}
              className="px-5 xl:px-7 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm xl:text-base transition"
            >
              Log In
            </button>


            <button
              onClick={() => navigate("/signup")}
              className="px-5 xl:px-7 py-2 rounded-full bg-black hover:bg-gray-900 text-white text-sm xl:text-base transition"
            >
              Sign Up
            </button>

          </>


        ) : (

          <>


            {isAdmin && (

              <button
                onClick={() => navigate("/admin")}
                className="px-5 py-2 rounded-full bg-blue-600 text-white"
              >
                Dashboard
              </button>

            )}




            {!isAdmin && (

              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 hover:text-red-600 transition"
              >

                <ShoppingCart size={22} />


                {cartCount > 0 && (

                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">

                    {cartCount}

                  </span>

                )}


              </button>

            )}





            <span className="font-medium text-black">
              {user?.name}
            </span>


            <button
              onClick={logout}
              className="px-5 py-2 rounded-full bg-red-600 text-white"
            >
              Logout
            </button>


          </>

        )}


      </div>






      {/* Mobile Button */}

      <div className="flex lg:hidden items-center">

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >

          <svg
            className="w-7 h-7 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >

            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />

          </svg>

        </button>

      </div>






      {/* Mobile Menu */}

      <div
        className={`fixed inset-0 bg-white flex flex-col lg:hidden items-center justify-center gap-8 text-lg font-medium transition-transform duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <button
          className="absolute top-6 right-6"
          onClick={() => setIsMenuOpen(false)}
        >

          <svg
            className="w-7 h-7 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >

            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />

          </svg>

        </button>




        {navLinks.map((link, i) => (

          <button
            key={i}
            onClick={() => {
              navigate(link.path);
              setIsMenuOpen(false);
            }}
            className="text-black hover:text-red-600 transition"
          >

            {link.name}

          </button>

        ))}



      </div>


    </nav>

  );

};


export default Header;