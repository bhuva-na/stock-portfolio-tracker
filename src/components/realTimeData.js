import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';


const RealTimeData = () => {
  const { stock } = useParams(); // Getting the data from path sended by Portfolio component
  const [realTimeData, setRealTimeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("token"))
      {
      navigate('/')
      }
  else
      {
    const formData = new FormData();
    formData.append('symbol', stock);
    const token = localStorage.getItem('token');
    axios.post('http://127.0.0.1:5000/get-stock-data', formData,{  // Axios call to fetch the real time data of the symbol is clicked
    headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const { data } = response;
      // Ensure data structure is as expected
      if (data && data['Meta Data'] && data['Time Series (5min)']) {
        setRealTimeData(data); // Set the entire response data to state
      } 
      else 
      {
        console.error('Invalid data format received:', data);
        setRealTimeData(null); // Clear previous data 
      }
    })
    .catch(error => {
      console.error('Error fetching stock data:', error);
      setRealTimeData(null); // Clear previous data 
    });
  }
    
  }, [stock]);

  const handleNavigateToChart = () => {
    navigate('/stock-chart', { state: { data: realTimeData } }); // Passing the response as the navigation state to another component to display the chart 
  };

  if (!realTimeData) {
    return (
      <div>
        <Container style={{backgroundColor:"GrayText"}}>
          <Spinner animation="border" role="status" style={{marginLeft:"45%"}}>
            <span className="visually-hidden" >Loading...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  // Check if metaData is available before rendering
  const metaData = realTimeData['Meta Data'];
  const timeSeries = realTimeData['Time Series (5min)'];

  if (!metaData || !timeSeries) {
    return (
      <div>
        <Container>
          <p>Error: Invalid data format received</p>
        </Container>
      </div>
    );
  }

  const handleLogout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    navigate('/')

  }

  return (
    <div>
      <Container>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand>
              <h2>{metaData['2. Symbol']} Intraday Data</h2>
              <p>Last Refreshed: {metaData['3. Last Refreshed']}</p>
              <Button
          variant="primary"
          onClick={handleNavigateToChart}
         
        >
          View Stock Chart
        </Button>{' '}
        <Button
          variant="primary"
          onClick={handleLogout}>
          LOGOUT
        </Button>
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(timeSeries).map(timestamp => (
              <tr key={timestamp}>
                <td>{timestamp}</td>
                <td>{timeSeries[timestamp]['1. open']}</td>
                <td>{timeSeries[timestamp]['2. high']}</td>
                <td>{timeSeries[timestamp]['3. low']}</td>
                <td>{timeSeries[timestamp]['4. close']}</td>
                <td>{timeSeries[timestamp]['5. volume']}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default RealTimeData;
