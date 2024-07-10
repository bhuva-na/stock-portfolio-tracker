import React, { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import loginPageIMG from "../images/loginPageIMG.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Register = () => {
  // UseStates
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token')){
      navigate('/')
    }}, [navigate])
  
  
    const handleRegister = ( ) => {
    const formData = new FormData();
    formData.append("name", username);
    formData.append("password", password);

    axios.post("http://127.0.0.1:5000/register", formData)
      .then((response) => {
        console.log(response);
        setMessage(response.data.message);
        navigate("/");
      })
      .catch((error) => {
        setMessage("Registration failed. Please try again.");
      });
  };

  return (
    <div style={{ backgroundColor: "#FFFCF0", padding: "5% 0% 10% 5%" }}>
      <Container>
        <Row>
          <Col>
            <div>
              <img
                src={loginPageIMG}
                alt="Logo"
                width="550"
                style={{ marginTop: "15%" }}
              />
            </div>
          </Col>
          <Col>
            <div style={{ marginTop: "20%" }}>
              <h2>REGISTER</h2>
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-4" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Col sm="7">
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Col sm="7">
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              <p>{message}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
