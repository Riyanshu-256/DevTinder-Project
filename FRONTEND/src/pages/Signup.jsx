import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

import { BASE_URL } from "../utils/constants";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-gradient px-4">
      <div className="auth-card hover-lift w-full max-w-md animate-fadeUp">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-2">
            Join DevConnect and start building your network
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-error text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label my-1">
                <span className="label-text flex items-center gap-2">
                  <FaUser /> First Name
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label my-1">
                <span className="label-text">Last Name</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label my-1">
              <span className="label-text flex items-center gap-2">
                <FaEnvelope /> Email
              </span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label my-1">
              <span className="label-text flex items-center gap-2">
                <FaLock /> Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Use at least 8 characters with a mix of letters & symbols
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary-gradient w-full ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline transition"
            >
              Sign in
            </Link>
          </p>

          <p className="text-xs text-gray-500">
            Secure signup using HttpOnly cookies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
