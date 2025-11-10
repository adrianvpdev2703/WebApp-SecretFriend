import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, FormControl } from "react-bootstrap";
import useAuthentication from "../../../hooks/useAuthentication";

const SorteosList = () => {
    const navigate = useNavigate();
    useAuthentication(true);

    const [sorteos, setSorteos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [startingId, setStartingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        const fetchSorteos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await fetch("http://localhost:3000/api/sorteos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("No se pudieron cargar los sorteos.");
                }
                const data = await response.json();
                setSorteos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSorteos();
    }, [navigate]);

    // (handleStart... no cambia)
    const handleStart = async id => {
        if (!window.confirm("¿Estás seguro de iniciar este sorteo? Esta acción no se puede deshacer.")) {
            return;
        }
        setStartingId(id);
        setActionError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await fetch(`http://localhost:3000/api/sorteos/${id}/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "No se pudo iniciar el sorteo.");
            }
            const result = await response.json();
            setSorteos(currentSorteos =>
                currentSorteos.map(sorteo => {
                    if (sorteo.id === id) {
                        return { ...sorteo, status: "iniciado", accessHash: result.accessHash };
                    }
                    return sorteo;
                }),
            );
        } catch (err) {
            setActionError(err.message);
        } finally {
            setStartingId(null);
        }
    };

    // (handleDelete... no cambia)
    const handleDelete = async id => {
        if (!window.confirm("¿Estás seguro de BORRAR este sorteo? Esta acción es permanente.")) {
            return;
        }
        setDeletingId(id);
        setActionError(null);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:3000/api/sorteos/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "No se pudo borrar el sorteo.");
            }
            setSorteos(currentSorteos => currentSorteos.filter(sorteo => sorteo.id !== id));
        } catch (err) {
            setActionError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleCreateNew = () => {
        navigate("/sorteo/crear");
    };

    // --- NUEVA FUNCIÓN ---
    /**
     * Navega a la página de edición, pasando el objeto 'sorteo'
     * en el 'state' de la navegación.
     */
    const handleEdit = sorteo => {
        navigate(`/sorteo/edit/${sorteo.id}`, { state: { sorteo } });
    };

    // (renderContent... con modificaciones)
    const renderContent = () => {
        // (Renderizado de loading, error, y lista vacía no cambia)
        if (loading) {
            return (
                <div className="text-center mt-5">
                    <Spinner animation="border" />
                </div>
            );
        }
        if (error) {
            return (
                <Alert variant="danger" className="mt-3">
                    Error al cargar la lista: {error}
                </Alert>
            );
        }
        if (sorteos.length === 0) {
            return (
                <div className="text-center mt-5">
                    <h4>No has creado ningún sorteo.</h4>
                    <p>¡Empieza creando uno nuevo!</p>
                </div>
            );
        }

        return (
            <Row xs={1} md={2} lg={3} className="g-4 mt-2">
                {sorteos.map(sorteo => (
                    <Col key={sorteo.id}>
                        <Card>
                            {/* ... Card.Header y Card.Body no cambian ... */}
                            <Card.Header as="h5">{sorteo.name}</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    <Badge bg={sorteo.status === "pendiente" ? "warning" : "success"}>{sorteo.status}</Badge>
                                </Card.Title>
                                <Card.Text className="mt-2">
                                    <strong>Participantes:</strong> {sorteo.participants.length}
                                </Card.Text>
                                <Card.Text>
                                    <small className="text-muted">Creado el: {new Date(sorteo.createdAt).toLocaleDateString()}</small>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-end">
                                {sorteo.status === "pendiente" ? (
                                    <>
                                        {/* --- BOTÓN EDITAR AÑADIDO --- */}
                                        <Button variant="secondary" size="sm" onClick={() => handleEdit(sorteo)} disabled={startingId !== null || deletingId !== null}>
                                            Editar
                                        </Button>

                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleStart(sorteo.id)}
                                            disabled={startingId !== null || deletingId !== null}
                                        >
                                            {startingId === sorteo.id ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" /> Iniciando...
                                                </>
                                            ) : (
                                                "Iniciar Sorteo"
                                            )}
                                        </Button>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleDelete(sorteo.id)}
                                            disabled={startingId !== null || deletingId !== null}
                                        >
                                            {deletingId === sorteo.id ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" /> Borrando...
                                                </>
                                            ) : (
                                                "Borrar"
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {/* ... (Renderizado del accessHash no cambia) ... */}
                                        <small className="text-muted">Link de acceso:</small>
                                        <FormControl type="text" readOnly value={sorteo.accessHash} size="sm" className="mt-1" />
                                    </>
                                )}
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    // (Return principal no cambia)
    return (
        <>
            <Header />
            <Container className="mt-3">
                <Row className="align-items-center">
                    <Col>
                        <h2>Mis Sorteos</h2>
                    </Col>
                    <Col className="text-end">
                        <Button variant="primary" onClick={handleCreateNew}>
                            + Crear Nuevo Sorteo
                        </Button>
                    </Col>
                </Row>
                <hr />

                {actionError && (
                    <Alert variant="danger" onClose={() => setActionError(null)} dismissible>
                        <strong>Error en la acción:</strong> {actionError}
                    </Alert>
                )}

                {renderContent()}
            </Container>
        </>
    );
};

export default SorteosList;
