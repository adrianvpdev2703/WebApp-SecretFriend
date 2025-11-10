import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

// --- PASO 1: Importar las "herramientas" ---
import useAuthentication from "../../hooks/useAuthentication";
import { getAccessToken } from "../../utils/tokenUtilities";

const Header = () => {
    // --- PASO 2: Llamar al hook y a la utilidad ---
    const { doLogout, userEmail } = useAuthentication();
    const isLoggedIn = !!getAccessToken(); // '!!' convierte el token (string) o null en true/false

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                {/* Usamos 'as={Link}' para que funcione con React Router */}
                <Navbar.Brand as={Link} to="/">
                    Secret Friend
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* === LADO IZQUIERDO === */}
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>

                        {/* Renderizado Condicional: 
                            Este dropdown SÓLO se muestra si isLoggedIn es true */}
                        {isLoggedIn && (
                            <NavDropdown title="Sorteos" id="sorteos-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/sorteo/crear">
                                    Crear Sorteo
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/sorteo/list">
                                    Ver Mis Sorteos
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>

                    {/* === LADO DERECHO === */}
                    {/* Ponemos un <Nav> separado para que se alinee a la derecha */}
                    <Nav>
                        {/* Renderizado Condicional con un "operador ternario" */}
                        {isLoggedIn ? (
                            // --- SI ESTÁ LOGUEADO ---
                            <NavDropdown title={userEmail || "Usuario"} id="user-nav-dropdown">
                                {/* 'onClick' es perfecto para 'doLogout' */}
                                <NavDropdown.Item onClick={doLogout}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            // --- SI NO ESTÁ LOGUEADO ---
                            <NavDropdown title="Inicio Sesion" id="login-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/register">
                                    Register
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/login">
                                    Login
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
