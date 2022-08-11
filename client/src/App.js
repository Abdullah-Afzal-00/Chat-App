import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RequireAuth from "./RequireAuth";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import FindUser from "./components/FindUser";
import NotFound from "./NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/signUp" element={<SignUp />}></Route>
      <Route element={<RequireAuth />}>
        <Route element={<Navbar />}>
          <Route path="main" element={<Main />}></Route>
          <Route path="findUser" element={<FindUser />}></Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
  //return <>In the App</>;
}

export default App;
