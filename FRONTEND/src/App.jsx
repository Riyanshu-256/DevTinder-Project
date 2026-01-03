import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Landing from "./components/Landing";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Signup from "./components/Signup";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

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
