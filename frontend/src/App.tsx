import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import Deals from "./pages/Deals";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/deals" element={<Deals />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
