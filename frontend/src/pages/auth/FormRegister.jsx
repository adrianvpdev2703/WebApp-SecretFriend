import Header from "../../components/Header";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthentication from "../../../hooks/useAuthentication";

const FormRegister = () => {
    const navigate = useNavigate();

    const { doRegister } = useAuthentication();

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

        doRegister({
            username,
            email,
            password,
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
                                                <Form.Label>
                                                    Nombre de Usuario <RequiredLabel />
                                                </Form.Label>
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
                                                <FormControl.Feedback type="invalid">El nombre de usuario es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <Form.Label>
                                                    Email <RequiredLabel />
                                                </Form.Label>
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
                                                <Form.Label>
                                                    Password <RequiredLabel />
                                                </Form.Label>
                                                <FormControl
                                                    id="txtPassword"
                                                    required
                                                    minLength={6}
                                                    maxLength={100}
                                                    type="password"
                                                    value={password}
                                                    onChange={e => {
                                                        setPassword(e.target.value);
                                                    }}
                                                />
                                                <FormControl.Feedback type="invalid">La password es obligatoria (mínimo 6 caracteres)</FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">
                                            Registrarse
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
