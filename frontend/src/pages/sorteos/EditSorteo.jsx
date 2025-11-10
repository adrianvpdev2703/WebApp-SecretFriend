// src/pages/sorteos/EditSorteo.jsx

import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Alert } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // <-- Imports añadidos
import Header from "../../components/Header";
import RequiredLabel from "../../components/RequiredLabel";
import useAuthentication from "../../../hooks/useAuthentication";

const EditSorteo = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // <-- Obtiene el ID del sorteo de la URL
    const location = useLocation(); // <-- Obtiene el 'state' pasado desde 'navigate'

    useAuthentication(true);

    // Estados del formulario
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [participants, setParticipants] = useState("");

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);

    // --- NUEVO: Hook para rellenar el formulario ---
    useEffect(() => {
        // Obtenemos el objeto 'sorteo' que pasamos desde SorteosList
        const { sorteo } = location.state || {};

        if (sorteo) {
            // Rellenamos los estados con los datos existentes
            setName(sorteo.name);

            // Formateamos la fecha para el input tipo 'date' (YYYY-MM-DD)
            const formattedDate = sorteo.date ? new Date(sorteo.date).toISOString().split("T")[0] : "";
            setDate(formattedDate);

            // Convertimos el array de participantes de nuevo a un string (un nombre por línea)
            const participantsString = sorteo.participants.map(p => p.name).join("\n");
            setParticipants(participantsString);
        } else {
            // Si el usuario llega aquí sin datos (ej. recargando la página),
            // lo mejor es enviarlo de vuelta a la lista.
            console.error("No se pasaron datos del sorteo. Redirigiendo...");
            navigate("/");
        }
    }, [location.state, navigate]); // Se ejecuta si los datos de 'location' cambian

    /**
     * Manejador para el envío del formulario (ACTUALIZAR)
     */
    const handleSubmit = async event => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(true);
        setError(null);

        // (La lógica de procesar 'participantsArray' es idéntica)
        const participantsArray = participants
            .split("\n")
            .map(p => p.trim())
            .filter(p => p.length > 0);

        if (participantsArray.length < 3) {
            setError("Se requieren al menos 3 participantes para un sorteo.");
            setValidated(false);
            return;
        }

        const sorteoData = {
            name: name,
            date: date,
            participants: participantsArray,
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            // --- CAMBIOS EN EL FETCH ---
            const response = await fetch(`http://localhost:3000/api/sorteos/${id}`, {
                // <-- URL con ID
                method: "PUT", // <-- Método PUT
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sorteoData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "No se pudo actualizar el sorteo.");
            }

            console.log("Sorteo actualizado");
            navigate("/sorteo/list"); // Volver a la lista de sorteos
        } catch (err) {
            setError(err.message);
        }
    };

    const onCancelClick = () => {
        navigate("/");
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2 justify-content-center">
                    <Col md={8} xl={6}>
                        <Card>
                            <Card.Body>
                                {/* --- Textos Actualizados --- */}
                                <Card.Title as="h2">Editar Sorteo</Card.Title>
                                <Card.Text>Actualiza los datos de tu Amigo Secreto.</Card.Text>
                                {/* ------------------------- */}

                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    {error && <Alert variant="danger">{error}</Alert>}

                                    {/* (El resto del formulario es idéntico a CreateSorteo) */}
                                    <FormGroup className="mb-3">
                                        <RequiredLabel htmlFor="txtName">Nombre del Sorteo</RequiredLabel>
                                        <FormControl
                                            id="txtName"
                                            required
                                            maxLength={100}
                                            type="text"
                                            placeholder="Ej: Navidad Oficina 2025"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">El nombre es obligatorio.</FormControl.Feedback>
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <RequiredLabel htmlFor="txtDate">Fecha del Sorteo</RequiredLabel>
                                        <FormControl id="txtDate" required type="date" value={date} onChange={e => setDate(e.target.value)} />
                                        <FormControl.Feedback type="invalid">La fecha es obligatoria.</FormControl.Feedback>
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <RequiredLabel htmlFor="txtParticipants">Participantes</RequiredLabel>
                                        <FormControl
                                            id="txtParticipants"
                                            required
                                            as="textarea"
                                            rows={8}
                                            placeholder="Escribe un nombre por línea..."
                                            value={participants}
                                            onChange={e => setParticipants(e.target.value)}
                                        />
                                        <Form.Text muted>Escribe un participante por cada línea. Se requieren al menos 3.</Form.Text>
                                        <FormControl.Feedback type="invalid">Debes ingresar a los participantes.</FormControl.Feedback>
                                    </FormGroup>

                                    <div className="mt-3">
                                        {/* --- Texto de Botón Actualizado --- */}
                                        <Button variant="primary" type="submit">
                                            Guardar Cambios
                                        </Button>
                                        <Button variant="secondary" className="ms-2" onClick={onCancelClick}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default EditSorteo;
