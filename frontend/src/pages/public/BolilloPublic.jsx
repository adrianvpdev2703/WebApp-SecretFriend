// src/pages/public/BolilloPublic.jsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Toast, ToastContainer } from "react-bootstrap";
import Header from "../../components/Header";

const BolilloPublic = () => {
    const { personalHash } = useParams(); // Lee el hash personal de la URL

    // --- Estados de Datos ---
    // 1. A quién me tocó regalarle
    const [assignedPersonName, setAssignedPersonName] = useState("...");
    // 2. La wishlist de esa persona
    const [assignedPersonWishlist, setAssignedPersonWishlist] = useState("");
    // 3. Mi propia wishlist (controlada por el <textarea>)
    const [myWishlist, setMyWishlist] = useState("");

    // --- Estados de Carga y Guardado ---
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false); // Para el "Toast" de éxito

    // 1. Cargar datos del bolillo (Endpoint 3.3) al abrir la página
    useEffect(() => {
        const fetchBolilloInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/public/bolillo/${personalHash}`);

                if (response.status === 404) {
                    throw new Error("El link personal no es válido o ha expirado.");
                }
                if (!response.ok) {
                    throw new Error("No se pudo cargar tu información.");
                }

                const data = await response.json();

                setAssignedPersonName(data.assignedPersonName);
                setAssignedPersonWishlist(data.assignedPersonWishlist || ""); // (Previene 'null')
                setMyWishlist(data.myWishlist || ""); // (Previene 'null')
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBolilloInfo();
    }, [personalHash]); // Se ejecuta si el hash cambia

    // 2. Guardar mi wishlist (Endpoint 3.4)
    const handleSaveWishlist = async event => {
        event.preventDefault(); // Prevenir recarga de página
        setSaving(true);
        setError(null);
        setShowSaveSuccess(false);

        try {
            const response = await fetch(`http://localhost:3000/api/public/bolillo/${personalHash}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wishlist: myWishlist }), // Envía mi wishlist
            });

            if (!response.ok) {
                throw new Error("No se pudo guardar tu lista. Intenta de nuevo.");
            }

            // ¡Éxito!
            setShowSaveSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // --- Renderizado ---

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" /> <p>Descubriendo tu amigo secreto...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        {/* Notificación de "Guardado con éxito" */}
                        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
                            <Toast onClose={() => setShowSaveSuccess(false)} show={showSaveSuccess} delay={3000} autohide bg="success" color="white">
                                <Toast.Body className="text-white">¡Lista de deseos guardada!</Toast.Body>
                            </Toast>
                        </ToastContainer>

                        {/* Alerta de Errores */}
                        {error && (
                            <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                {error}
                            </Alert>
                        )}

                        {/* --- CARD 1: EL RESULTADO --- */}
                        <Card className="text-center shadow-sm mb-4">
                            <Card.Header as="h3">¡Amigo Secreto!</Card.Header>
                            <Card.Body>
                                <Card.Text style={{ fontSize: "1.2rem" }}>Te tocó regalarle a:</Card.Text>
                                <Card.Title as="h1" className="display-4 text-primary">
                                    {assignedPersonName}
                                </Card.Title>

                                <hr />
                                <Card.Text className="text-start mt-3">
                                    <strong>Su lista de deseos:</strong>
                                </Card.Text>
                                <Card className="bg-light">
                                    <Card.Body className="text-start">
                                        <blockquote className="blockquote mb-0">
                                            <p>{assignedPersonWishlist || <em className="text-muted">{assignedPersonName} todavía no ha escrito su lista de deseos.</em>}</p>
                                        </blockquote>
                                    </Card.Body>
                                </Card>
                            </Card.Body>
                            <Card.Footer className="text-muted">¡Guarda este link! Con él podrás volver a ver esta página.</Card.Footer>
                        </Card>

                        {/* --- CARD 2: MI WISHLIST --- */}
                        <Card className="shadow-sm">
                            <Card.Header as="h4">Tu Lista de Deseos</Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSaveWishlist}>
                                    <Form.Group controlId="wishlistTextarea">
                                        <Form.Label>Escribe lo que te gustaría recibir para que tu amigo secreto pueda verlo:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            placeholder="Ej: Me gustaría chocolates, un libro de ciencia ficción, o calcetines divertidos..."
                                            value={myWishlist}
                                            onChange={e => setMyWishlist(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" /> Guardando...
                                            </>
                                        ) : (
                                            "Guardar mi lista"
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BolilloPublic;
