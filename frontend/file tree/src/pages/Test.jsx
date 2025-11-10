import { useEffect, useState } from "react";
import Header from "../components/Header";

function Test() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // La URL DEBE ser la dirección completa de tu backend
        const apiUrl = "http://localhost:3000/api/auth/test";

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("La petición falló");
                }
                return response.json();
            })
            .then(data => {
                // data debería ser { message: "Auth route is working!" }
                setMessage(data.message);
            })
            .catch(error => {
                console.error("Error al conectar con la API:", error);
                setMessage("Error al conectar con la API");
            });
    }, []); // El array vacío [] hace que se ejecute solo una vez, cuando el componente carga

    return (
        <div>
            <Header />
            <h1>Probando la API de Amigo Secreto</h1>
            <p>
                Respuesta de la API: <strong>{message}</strong>
            </p>
        </div>
    );
}

export default Test;
