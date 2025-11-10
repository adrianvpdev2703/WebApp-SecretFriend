import { Navbar, Container, Nav, NavDropdown, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#home">Secret Friend</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <Link className="dropdown-item" to="/">
                                Index
                            </Link>
                            <Link className="dropdown-item" to="/test">
                                test
                            </Link>
                        </NavDropdown>
                        <NavDropdown title="Inicio Sesion" id="basic-nav-dropdown">
                            <Link className="dropdown-item" to="/register">
                                Register
                            </Link>
                            <Link className="dropdown-item" to="/login">
                                Login
                            </Link>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
