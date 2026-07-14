import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // رسالة نجاح
      setSuccess("✅ تم تسجيل الدخول بنجاح");

      const role = data.role || "user";
      const redirect = data.redirect || (role === "admin" ? "/admin" : "/");

      // الانتقال بعد ثانيتين
      setTimeout(() => {
        navigate(redirect, { replace: true });
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-4">

    <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">
        Login
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
    </div>
  );
}

export default Login;