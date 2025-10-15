import { useState } from "react";
import axiosClient from "../api/axiosClient.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      // ✅ Use the same route as your Express backend
      console.log(form);
      const res = await axiosClient.post("/login", form);
      console.log(res);

      if (res.status === 200) {
        setSuccess("Login successful!");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid email or password. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back to Wanderlust
        </h2>

        {success && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg px-4 py-2">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold p-3 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>

          <p className="text-center text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
