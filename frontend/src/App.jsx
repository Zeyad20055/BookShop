import "./App.css";

import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

import { Routes, Route, useLocation } from "react-router-dom";

import AdminLayout from "./components/admin/AdminLayout";
import AddBook from "./components/admin/AddBook";
import AllBook from "./components/admin/AllBook";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { AuthProvider } from "./auth/AuthContext";
import AdminRoute from "./auth/AdminRoute";

import UpdateBook from "./components/admin/updateBook";


function App() {

  const location = useLocation();


  const hideHeader = /^\/admin(\/|$)/.test(location.pathname);



  return (

    <AuthProvider>

      {!hideHeader && <Header />}



      <Routes>


        {/* Home */}

        <Route 
          path="/" 
          element={<Home />} 
        />



        {/* Cart */}

        <Route 
          path="/cart" 
          element={<Cart />} 
        />



        {/* Auth */}

        <Route 
          path="/login" 
          element={<Login />} 
        />


        <Route 
          path="/signup" 
          element={<Signup />} 
        />




        {/* Admin */}

        <Route

          path="/admin"

          element={

            <AdminRoute>

              <AdminLayout />

            </AdminRoute>

          }

        >


          <Route 
            index 
            element={<AllBook />} 
          />


          <Route 
            path="all-book" 
            element={<AllBook />} 
          />



          <Route 
            path="add-book" 
            element={<AddBook />} 
          />



          <Route 
            path="updateBook/:id" 
            element={<UpdateBook />} 
          />



        </Route>



      </Routes>


    </AuthProvider>

  );

}


export default App;