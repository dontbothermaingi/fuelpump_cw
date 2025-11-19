import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [confirm_password, setConfirm_password] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const nav = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting form data:", formData);

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please check your credentials.");
      }

      const data = await response.json();

      alert("Successfully Registered");
      nav("/login");
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
          Register
        </h2>
        <p style={{ fontFamily: "IT Regular" }} className="text-gray-500 mb-6">
          Please fill in the details to create an account.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Form Itself */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              style={{ fontFamily: "IT Medium" }}
              className="font-medium mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

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
              Role
            </label>
            <select
              value={formData.role}
              onChange={handleChange}
              name="role"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
            >
              <option value="">Select Role</option>
              <option value={"Admin"}>Admin</option>
              <option value={"Staff"}>Staff</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              style={{ fontFamily: "IT Medium" }}
              className="font-medium mb-1"
            >
              Password
            </label>

            <div className="flex items-center gap-5">
              <input
                type={viewPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div onClick={() => setViewPassword(!viewPassword)} className="">
                {viewPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              style={{ fontFamily: "IT Medium" }}
              className="font-medium mb-1"
            >
              Confirm Password
            </label>

            <div className="flex items-center gap-5">
              <input
                type={viewPassword ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                value={confirm_password}
                onChange={(e) => setConfirm_password(e.target.value)}
                placeholder="Enter your password"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div onClick={() => setViewPassword(!viewPassword)} className="">
                {viewPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="pt-5 cursor-pointer" onClick={() => nav("/login")}>
          Already Registered? <span className="text-blue-500">Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
