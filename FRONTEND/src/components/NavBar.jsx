import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import logo from "../assets/logo.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isHomePage = location.pathname === "/";
  const user = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });

      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div>
      {/* ================= NAVBAR ================= */}
      <div className="navbar bg-base-300 border-b border-base-200 px-6 sticky top-0 z-50">
        {/* Left: Brand */}
        <div className="flex-1">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
          >
            <img
              src={logo}
              alt="DevConnect Logo"
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-bold tracking-tight">
              Dev<span className="text-primary">Connect</span>
            </span>
          </div>
        </div>

        {/* Right: User Dropdown */}
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="flex items-center gap-3 cursor-pointer px-3 py-1 rounded-full hover:bg-base-200 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 leading-tight">Welcome</p>
                <p className="font-semibold leading-tight">{user.firstName}</p>
              </div>

              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    src={
                      user.photoUrl ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt="User Avatar"
                  />
                </div>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-4 w-56 rounded-2xl bg-base-100 p-3 shadow-xl border border-base-200"
            >
              <li className="menu-title px-2">
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  Account
                </span>
              </li>

              <li>
                <a onClick={() => navigate("/profile")}>👤 Profile</a>
              </li>

              <li>
                <a>⚙️ Settings</a>
              </li>

              <div className="divider my-1"></div>

              <li>
                <a onClick={handleLogout} className="text-error">
                  🚪 Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ================= HERO ================= */}
      {isHomePage && (
        <section className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Connect with <span className="text-primary">Developers</span>
            </h1>
          </div>
        </section>
      )}
    </div>
  );
};

export default NavBar;
