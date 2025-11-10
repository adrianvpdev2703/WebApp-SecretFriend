import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import RequiredLabel from "../../components/RequiredLabel";
import useAuthentication from "../../../hooks/useAuthentication";

const CreateSorteo = () => {
    const navigate = useNavigate();
    useAuthentication(true);

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [participants, setParticipants] = useState("");

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);

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
                setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                navigate("/login");
                return;
            }

            const response = await fetch("http://localhost:3000/api/sorteos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sorteoData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "No se pudo crear el sorteo.");
            }

            const nuevoSorteo = await response.json();
            console.log("Sorteo creado:", nuevoSorteo);

            navigate("/sorteo/list");
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
                                <Card.Title as="h2">Crear nuevo sorteo</Card.Title>
                                <Card.Text>Completa los datos para tu nuevo Amigo Secreto.</Card.Text>

                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    {error && <Alert variant="danger">{error}</Alert>}

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
                                        <Button variant="primary" type="submit">
                                            Crear Sorteo
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

export default CreateSorteo;
