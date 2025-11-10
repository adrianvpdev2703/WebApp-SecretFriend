import Banner from "../assets/shhhh.jpeg";
import Header from "../components/Header";
import { Card } from "react-bootstrap";
import Test from "./Test";

function App() {
    return (
        <>
            <Header />
            <Card className="text-white" style={{ border: "none" }}>
                <Card.Img
                    src={Banner}
                    alt="Hero Banner"
                    style={{
                        maxHeight: "400px",
                        objectFit: "cover",
                        width: "100%",
                    }}
                />
                <Card.ImgOverlay
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <Card.Title as="h1">Un Título Atractivo</Card.Title>
                    <Card.Text>Nulla vitae elit libero, a pharetra augue mollis interdum.</Card.Text>
                </Card.ImgOverlay>
            </Card>
            <Test />
        </>
    );
}

export default App;
