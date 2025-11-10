import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Test from "./pages/Test.jsx";
import FormRegister from "./pages/auth/FormRegister.jsx";
import FormLogin from "./pages/auth/FormLogin.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/test" element={<Test />} />
                <Route path="/register" element={<FormRegister />} />
                <Route path="/login" element={<FormLogin />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
