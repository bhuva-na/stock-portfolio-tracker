import React, { useState } from 'react';
import axios from 'axios';
import Portfolio from './Portfolio';

const AutoComplete = () => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSymbols = () => {
    if (!keyword) {
      setSuggestions([]);
      return;
    }

    const formData = new FormData();
    formData.append('keyword', keyword);
    const token = localStorage.getItem("token");

    axios.post('http://127.0.0.1:5000/fetch-bestmatch', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setSuggestions(response.data.bestMatches || []);
      })
      .catch(error => {
        console.error('Error fetching stock symbols:', error);
        setSuggestions([]);
      });
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const handleSearch = () => {
    fetchSymbols();
  };

  const handleSuggestionClick = (symbol) => {
    setKeyword(symbol);
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={handleInputChange}
        placeholder="Search for stock symbols"
      />
      <button onClick={handleSearch}>Search</button>
      <Portfolio   symbol={keyword}/>
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion['1. symbol'])}>
              {suggestion['1. symbol']} - {suggestion['2. name']}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
