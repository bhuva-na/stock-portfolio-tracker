import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setClientLogin } from "../features/user/userSlice";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import loginPageIMG from "../images/loginPageIMG.png";

const Login = ( ) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
    useEffect(() => { // Restrict to comeback to login page when already login 
      if(localStorage.getItem('token')){
        navigate('/Autocomplete-alternative')
      }}, [navigate])
    
  const handleLogin = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);

    axios.post("http://127.0.0.1:5000/login", formData)
      .then((response) => {
        dispatch(setClientLogin({
            user: response.data.user_name,
            id: response.data.user_id,
          })
        );
        // Locally storing Token and ID for API Authentication
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("id", response.data.user_id);
        setMessage("Login successful");
        navigate("/Autocomplete-alternative");
        })
      .catch((error) => {
        setMessage("Login failed. Please try again.");
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
              <h2>LOGIN</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Col sm="7">
                    <Form.Control
                      type="text"
                      value={name}
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Col sm="7">
                    <Form.Control
                      className=" sm-5"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button variant="primary" type="submit">
                  Not Registered yet?<a href="/">Click Here</a>
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

export default Login;
