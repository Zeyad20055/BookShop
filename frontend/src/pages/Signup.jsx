import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Register failed");
      }

      // رسالة نجاح
      setSuccess("✅ تم التسجيل بنجاح");

      // الانتقال بعد ثانيتين
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-gray-100">
      <h1 className="text-2xl font-bold mb-5 text-center">
        Sign Up
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

      </form>
    </div>
  </div>
);
}

export default Signup;