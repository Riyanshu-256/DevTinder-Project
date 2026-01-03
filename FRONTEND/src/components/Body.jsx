import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (err) {
      dispatch(removeUser());

      if (location.pathname !== "/login" && location.pathname !== "/signup") {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/signup") {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Body;
