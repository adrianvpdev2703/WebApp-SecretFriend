import { useNavigate } from "react-router-dom";
import { getAccessToken, removeAccessToken, saveAccessToken } from "../utils/tokenUtilities";
import { useEffect } from "react";
import { login } from "../services/AuthService";

const useAuthentication = (checkOnload = false) => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail") || "";
    const validateLogin = () => {
        const token = getAccessToken();
        if (!token) {
            navigate("/login");
            return;
        }
    };
    const doLogin = loginData => {
        login(loginData)
            .then(response => {
                saveAccessToken(response.token);
                localStorage.setItem("userEmail", loginData.email);
                navigate("/");
            })
            .catch(() => {
                alert("Error al iniciar sesión");
            });
    };
    const doLogout = () => {
        removeAccessToken();
        navigate("/login");
    };
    useEffect(() => {
        if (!checkOnload) {
            return;
        }
        validateLogin();
        // eslint-disable-next-line
    }, [navigate]);

    return { doLogout, doLogin, userEmail };
};

export default useAuthentication;
