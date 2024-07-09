import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/esm/Table";
import Button from "react-bootstrap/esm/Button";

const Portfolio = ({ symbol }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const fetchPortfolio = () => {
    const token = localStorage.getItem("token");
    axios.get("http://127.0.0.1:5000/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPortfolio(response.data.portfolio);
      })
      .catch((error) => {
        setMessage("Failed to fetch portfolio. Please try again.");
      });
  };

  useEffect(() => {
    fetchPortfolio(); // Calling function in useEffect to fetch the data when the  page if refreshed
  }, []);

  const addStock = () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("symbol", symbol);
    axios
      .post("http://127.0.0.1:5000/add_stock", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMessage(response.data.message);
        setPortfolio(response.data.portfolio);
      })
      .catch((error) => {
        setMessage("Failed to add stock. Please try again.");
      });
  };

  const stockDetails = (stock) => {
    navigate(`/RealTimeData/${stock}`); // Sending symbol in path to another component to fetch the realtime data of that symbol
  };

  const removeStock = (symbol) => {
    const formData = new FormData();
    formData.append("symbol", symbol);
    const token = localStorage.getItem("token");
    axios
      .post("http://127.0.0.1:5000/remove_stock", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMessage(response.data.message);
        setPortfolio(response.data.portfolio);
      })
      .catch((error) => {
        setMessage("Failed to remove stock. Please try again.");
      });
  };
  const handleLogout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    navigate('/')

  }
  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <form onSubmit={addStock}>
            <Button variant="success" type="submit">
              Add Stock
            </Button>{' '}
            <Button
          variant="primary"
          onClick={handleLogout}>
          LOGOUT
        </Button>
          </form>
          <p>{message}</p>
        </Row>
        <Row xs lg="2">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th colSpan={3}>Added Stock</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock) => (
                <tr key={stock}>
                  <td>{stock}</td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="info"
                      onClick={() => stockDetails(stock)}
                      style={{ marginRight: "8px" }}
                    >
                      Details
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => removeStock(stock)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
</div>
  );
};
export default Portfolio;
