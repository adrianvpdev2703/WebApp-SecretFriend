// src/pages/public/SorteoPublic.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Alert, Badge } from "react-bootstrap";
import Header from "../../components/Header"; // Asumo que quieres el header aquí también

const SorteoPublic = () => {
    const { accessHash } = useParams(); // Lee el hash de la URL
    const navigate = useNavigate();

    // Estados para la carga
    const [sorteoName, setSorteoName] = useState("");
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para la acción de "clic"
    const [identifyingId, setIdentifyingId] = useState(null);

    // 1. Cargar datos del sorteo (Endpoint 3.1)
    useEffect(() => {
        const fetchSorteoInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/public/sorteo/${accessHash}`);

                if (response.status === 404) {
                    throw new Error("El link del sorteo no es válido o ha expirado.");
                }
                if (!response.ok) {
                    throw new Error("No se pudo cargar la información del sorteo.");
                }

                const data = await response.json();
                setSorteoName(data.sorteoName);
                setParticipants(data.participants); // Lista de { id, name }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSorteoInfo();
    }, [accessHash]); // Se ejecuta si el hash cambia

    // 2. Identificarse (Endpoint 3.2)
    const handleSelectParticipant = async participantId => {
        setIdentifyingId(participantId); // Poner el botón en modo "cargando"
        setError(null);

        try {
            const response = await fetch(`http://localhost:3000/api/public/sorteo/${accessHash}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participantId }), // Envía el ID del participante
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "No pudimos identificarte. Intenta de nuevo.");
            }

            const data = await response.json(); // Recibe { personalHash: "..." }

            // ¡Éxito! Redirigir a la página del Bolillo (Link 2)
            navigate(`/bolillo/${data.personalHash}`);
        } catch (err) {
            setError(err.message);
            setIdentifyingId(null); // Quitar el "cargando" si hay error
        }
    };

    // --- Renderizado ---

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" /> <p>Cargando sorteo...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card>
                            <Card.Header as="h3">¡Bienvenido al Sorteo!</Card.Header>
                            <Card.Body className="text-center">
                                <Card.Title as="h1" className="mb-3">
                                    {sorteoName}
                                </Card.Title>
                                <Card.Text>Para descubrir quién te tocó, por favor, identifícate haciendo clic en tu nombre:</Card.Text>

                                {error && (
                                    <Alert variant="danger" className="my-3">
                                        {error}
                                    </Alert>
                                )}

                                <ListGroup variant="flush" className="mt-3">
                                    {participants.length > 0 ? (
                                        participants.map(p => (
                                            <ListGroup.Item key={p.id}>
                                                <Button
                                                    variant="outline-primary"
                                                    size="lg"
                                                    className="w-100"
                                                    onClick={() => handleSelectParticipant(p.id)}
                                                    disabled={identifyingId !== null} // Deshabilitar todos si uno se está cargando
                                                >
                                                    {identifyingId === p.id ? (
                                                        <>
                                                            <Spinner as="span" animation="border" size="sm" /> Verificando...
                                                        </>
                                                    ) : (
                                                        p.name
                                                    )}
                                                </Button>
                                            </ListGroup.Item>
                                        ))
                                    ) : (
                                        // Esto pasa si todos ya se identificaron
                                        <Alert variant="info">
                                            <Badge pill bg="success">
                                                ¡Completo!
                                            </Badge>
                                            <p className="mt-2 mb-0">Parece que todos los participantes ya se han identificado.</p>
                                        </Alert>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SorteoPublic;
