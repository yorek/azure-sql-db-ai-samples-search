import React, { useState } from 'react';
import './SearchApp.css'; // Custom styles

const SearchApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setResults([]);
    
    // Mock API Call (replace with real API)
    try {
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve(['Result 1', 'Result 2', 'Result 3']), 1000)
      );
      setResults(response);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-app">
      <h1 className="title">Search Something</h1>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Type your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="results">
        {results.map((result, index) => (
          <div className="result-item" key={index}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchApp;
