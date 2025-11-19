import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      navigate("/");
      alert("Successfully logged in");

      // Store real token from backend
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Main Container
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Card Header */}
        <h2 style={{ fontFamily: "IT Bold" }} className="text-2xl mb-2">
          Welcome Back
        </h2>
        <p style={{ fontFamily: "IT Regular" }} className="text-gray-500 mb-6">
          Please sign in to continue
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Form Itself */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              style={{ fontFamily: "IT Medium" }}
              className="font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              style={{ fontFamily: "IT Medium" }}
              className="font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="pt-5 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Not Registered? <span className="text-blue-500">Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
