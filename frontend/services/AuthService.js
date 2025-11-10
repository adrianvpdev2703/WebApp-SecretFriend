import axios from "axios";

const login = loginData => {
    return new Promise((resolve, reject) => {
        axios
            .post("http://localhost:3000/api/auth/login", loginData)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
};

const register = registerData => {
    return new Promise((resolve, reject) => {
        axios
            .post("http://localhost:3000/api/auth/register", registerData)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
};
export { login, register };
