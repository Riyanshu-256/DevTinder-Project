import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/layout/Body";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Landing from "./pages/Landing";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import Signup from "./pages/Signup";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            {/* Landing page */}
            <Route index element={<Landing />} />

            {/* Public */}
            <Route path="login" element={<Login />} />

            {/* Signup */}
            <Route path="signup" element={<Signup />} />

            {/* Protected */}
            <Route path="feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
