import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Spinner,
  Card,
  CardHeader,
  CardFooter,
  CardPreview,
  Text,
  FluentProvider,
  teamsLightTheme,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import useStyles from './SearchApp.styles.js';

const SearchApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sampleCount, setSampleCount] = useState(0);
  const styles = useStyles();

  useEffect(() => {
    const fetchSampleCount = async () => {
      setLoading(true)
      // Mock API call
      const count = await new Promise((resolve) => setTimeout(() => resolve(42), 1000));
      setSampleCount(count);
      setLoading(false);
    };

    fetchSampleCount();
  }, []);

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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <FluentProvider theme={teamsLightTheme}>
      <div className={styles.appContainer}>
        <div className={styles.header}>
          <div className={styles.title}>
            Azure SQL DB Samples AI Search 💡🔍
          </div>
          <div className={styles.subtitle}>
            Explore sample data with AI-powered search capabilities 🚀
          </div>
          <p className={styles.sampleCount}>
            {loading ? 'Loading...' : `There are ${sampleCount} samples in the database.`}
          </p>
        </div>

        <div className={styles.searchWrapper} style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Type your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            contentBefore={<Search24Regular />}
            appearance="outline"
            className={styles.inputField}
          />
          <Button
            appearance="primary"
            onClick={handleSearch}
            disabled={loading}
            className={styles.searchButton}
          >
            Search
          </Button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spinner label="Loading..." />
          </div>
        )}

        {error && (
          <Text block style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </Text>
        )}

        <div>
          {results.map((result, index) => (
            <Card key={index} className={styles.resultCard}>
              <CardPreview>
                <Text block style={{ padding: '0 16px' }}>
                  Preview of {result}
                </Text>
              </CardPreview>
              <CardHeader
                header={<Text weight="bold">{result}</Text>}
                description={`Description for ${result}`}
              />
              <CardFooter>
                <Text>{`Footer Info for ${result}`}</Text>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </FluentProvider>
  );
};

export default SearchApp;
