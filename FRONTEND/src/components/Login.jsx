// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// import { addUser } from "../utils/userSlice";
// import { BASE_URL } from "../utils/constants";

// const Login = () => {
//   const [emailId, setEmailId] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((store) => store.user);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user?._id) {
//       navigate("/feed", { replace: true });
//     }
//   }, [user, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!emailId.trim() || !password) {
//       setError("Email and password are required");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const res = await axios.post(
//         `${BASE_URL}/login`,
//         {
//           emailId: emailId.trim().toLowerCase(),
//           password,
//         },
//         {
//           withCredentials: true,
//         }
//       );

//       dispatch(addUser(res.data));
//       navigate("/feed");
//     } catch (err) {
//       setError(
//         err.response?.data?.error ||
//           err.response?.data?.message ||
//           "Invalid email or password"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center my-10 px-4">
//       <div className="card bg-base-300 w-full max-w-md shadow-xl">
//         <div className="card-body">
//           <h2 className="card-title justify-center text-2xl">Welcome Back</h2>

//           <p className="text-center text-base-content/70 mb-6">
//             Sign in to continue to DevConnect
//           </p>

//           <form onSubmit={handleLogin} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <FaEnvelope /> Email
//                 </span>
//               </label>
//               <input
//                 type="email"
//                 className="input input-primary w-full"
//                 placeholder="abc@gmail.com"
//                 value={emailId}
//                 onChange={(e) => setEmailId(e.target.value)}
//                 autoComplete="email"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="label">
//                 <span className="label-text flex items-center gap-2">
//                   <FaLock /> Password
//                 </span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="input input-primary w-full pr-10"
//                   placeholder="********"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   autoComplete="current-password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="alert alert-error">
//                 <span>{error}</span>
//               </div>
//             )}

//             <button
//               type="submit"
//               className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing in..." : "Login"}
//             </button>
//           </form>

//           <p className="text-center text-sm mt-4">
//             Don’t have an account?{" "}
//             <Link to="/signup" className="link link-primary">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // SAME defaults as old code (important for testing)
  const [emailId, setEmailId] = useState("riyanshusharma123@gmail.com");
  const [password, setPassword] = useState("Riyanshu@123");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);

      // ⚠️ SAME payload as old code (NO lowercasing)
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );

      console.log("Login success:", res.data);

      dispatch(addUser(res.data));

      // ✅ SAME redirect as old code
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-300 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">
            Login to continue to DevConnect
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-error text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="label">
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
            <label className="label">
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
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="link link-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
