import Header from "../../components/Header";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const FormRegister = () => {
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const onFormSubmit = event => {
        const form = event.currentTarget;
        let hasErrors = false;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            hasErrors = true;
        }

        setValidated(true);

        if (hasErrors) {
            return;
        }

        sendRegisterForm();
    };

    const sendRegisterForm = () => {
        const registerData = {
            username,
            email,
            password,
        };

        axios
            .post("http://localhost:3000/api/auth/register", registerData)
            .then(response => {
                console.log(response.data);
                navigate("/");
            })
            .catch(error => {
                console.error(error);
                alert("Error al registrarse");
            });
    };

    const onCancelClick = () => {
        navigate("/");
    };

    return (
        <>
            <Header />
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <Row>
                                        <Col>
                                            <h1>Registro</h1>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtNombreCompleto" />
                                                NombreCompleto <RequiredLabel />
                                                <FormControl
                                                    id="txtNombreCompleto"
                                                    required
                                                    maxLength={100}
                                                    type="text"
                                                    value={username}
                                                    onChange={e => {
                                                        setUsername(e.target.value);
                                                    }}
                                                />
                                                <FormControl.Feedback type="invalid">El nombre completo es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtEmail" />
                                                Email <RequiredLabel />
                                                <FormControl
                                                    id="txtEmail"
                                                    required
                                                    maxLength={100}
                                                    type="email"
                                                    value={email}
                                                    onChange={e => {
                                                        setEmail(e.target.value);
                                                    }}
                                                />
                                                <FormControl.Feedback type="invalid">El email es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtPassword" />
                                                Password <RequiredLabel />
                                                <FormControl
                                                    id="txtPassword"
                                                    required
                                                    maxLength={100}
                                                    type="password"
                                                    value={password}
                                                    onChange={e => {
                                                        setPassword(e.target.value);
                                                    }}
                                                />
                                                <FormControl.Feedback type="invalid">La password es obligatoria</FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">
                                            Iniciar sesión
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

export default FormRegister;
