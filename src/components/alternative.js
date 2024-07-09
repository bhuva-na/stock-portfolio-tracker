import React, { useEffect, useState } from "react";
import axios from "axios";
import Portfolio from "./Portfolio";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { setClientLogin } from '../features/user/userSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

const AutoComplete_alternative = () => {
  // UseStates
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  // State to track if search button is clicked
  const [searched, setSearched] = useState(false); 
  const dispatch=useDispatch();
  const navigate=useNavigate();
  useEffect(()=>{
    // Locally storing Token and ID for API Authentication and to feching Data when the page is refreshed
    if(!localStorage.getItem("token")){
        navigate('/')
    }else{
      const token = localStorage.getItem("token");
      const id=localStorage.getItem('id')
      const formData = new FormData();
      formData.append("id", id);
      axios.post("http://127.0.0.1:5000/userDetails", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
       dispatch(setClientLogin({ user: response.data.user_name, id: response.data.user_id }));
      })
      .catch((error) => {
        console.error("Error fetching stock symbols:", error);
      });
    }
   
  },[dispatch]) // Adding dispatch in the dependency array,to send the api call when the dispatch is trigged
  
  const fetchSymbols = () => {
    if (!keyword) {
      setSuggestions([]);
      return;
    }

    const formData = new FormData();
    formData.append("keyword", keyword);
    const token = localStorage.getItem("token");

    axios.post("http://127.0.0.1:5000/fetch-bestmatch", formData, { //axios call to fetch the bestmatches of the symbol to search
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSuggestions(response.data.bestMatches|| []); 
      })
      .catch((error) => {
        console.error("Error fetching stock symbols:", error);
        setSuggestions([]);
      });
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setKeyword(value);
  };
  
  const handleSearch = () => {
    fetchSymbols();
    setSearched(true);
  };

  const handleSuggestionClick = (symbol) => {
    setKeyword(symbol);
    setSuggestions([]);
  };

  return (
    <div>
      <Container style={{marginTop:"3%"}}>
        <Row>
          <Col xs={9}  >
          <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search By Symbol"
          value={keyword}
            onChange={handleInputChange}
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <Button variant="outline-secondary" id="button-addon2"  onClick={handleSearch} >
          Search
        </Button>
      </InputGroup>
            {searched && suggestions.length > 0 && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((suggestion, index) => (
              <tr key={index} onClick={() => handleSuggestionClick(suggestion['1. symbol'])} style={{ cursor: 'pointer' }}>
                <td>{suggestion['1. symbol']}</td>
                <td>{suggestion['2. name']}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
          </Col>
          <Col xs={3}>
            <Portfolio symbol={keyword} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AutoComplete_alternative;
