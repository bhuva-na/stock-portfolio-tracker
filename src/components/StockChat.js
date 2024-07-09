import Button from 'react-bootstrap/Button';
import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const StockChart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
  if(!localStorage.getItem("token")){
    navigate('/')}}, [])

  const { data } = location.state || {};

  if (!data) {
    return <p>No data available</p>;
  }

  const timeSeries = data['Time Series (5min)'];
  const chartData = Object.keys(timeSeries).reverse().map(timestamp => ({
    timestamp,
    open: parseFloat(timeSeries[timestamp]['1. open']),
    high: parseFloat(timeSeries[timestamp]['2. high']),
    low: parseFloat(timeSeries[timestamp]['3. low']),
    close: parseFloat(timeSeries[timestamp]['4. close']),
    volume: parseFloat(timeSeries[timestamp]['5. volume']),
  }));

  const metaData = {
    symbol: data['Meta Data']['2. Symbol'],
    latestTradingDay: data['Meta Data']['3. Last Refreshed'],
    previousClose: data['Meta Data']['4. Interval'], 
    change: data['Meta Data']['5. Output Size'], 
    changePercent: data['Meta Data']['6. Time Zone'] 
  };

  const handleLogout=()=>{
      localStorage.removeItem("token")
      localStorage.removeItem("id")
      navigate('/')

    }

  return (
    <div>
      <Container>
      <h2 style={{marginLeft:"38%"}}>{metaData.symbol} STOCK CHART</h2>
     <Row>
      <Col><p>Latest Trading Day: {metaData.latestTradingDay}</p></Col>
      <Col><p>Previous Close: {metaData.previousClose}</p></Col>
      <Col><p>Change: {metaData.change}</p></Col>
      <Col><p>Change Percent: {metaData.changePercent}</p></Col>
      <Col><Button
          variant="primary"
          onClick={handleLogout}>
          LOGOUT
        </Button>
      </Col>
      </Row>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="open" fill="#8884d8" name="Open" />
          <Bar dataKey="high" fill="#82ca9d" name="High" />
          <Bar dataKey="low" fill="#ffc658" name="Low" />
          <Bar dataKey="close" fill="#ff7300" name="Close" />
          <Bar dataKey="volume" fill="#413ea0" name="Volume" />
        </BarChart>
      </ResponsiveContainer>
      </Container>
    </div>
  );
};

export default StockChart;
