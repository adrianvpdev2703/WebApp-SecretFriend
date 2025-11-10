import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Test from "./pages/Test.jsx";
import FormRegister from "./pages/auth/FormRegister.jsx";
import FormLogin from "./pages/auth/FormLogin.jsx";
import CreateSorteo from "./pages/sorteos/CreateSorteo.jsx";
import SorteosList from "./pages/sorteos/SorteosList.jsx";
import EditSorteo from "./pages/sorteos/EditSorteo.jsx";
import SorteoPublic from "./pages/public/SorteoPublic.jsx";
import BolilloPublic from "./pages/public/BolilloPublic.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/test" element={<Test />} />
                <Route path="/register" element={<FormRegister />} />
                <Route path="/login" element={<FormLogin />} />
                <Route path="/sorteo/crear" element={<CreateSorteo />} />
                <Route path="/sorteo/list" element={<SorteosList />} />
                <Route path="/sorteo/edit/:id" element={<EditSorteo />} />
                <Route path="/sorteo/:accessHash" element={<SorteoPublic />} />
                <Route path="/bolillo/:personalHash" element={<BolilloPublic />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
