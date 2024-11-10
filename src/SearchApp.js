import React, { useState } from 'react';
import {
  Input,
  Button,
  Spinner,
  Card,
  CardHeader,
  CardFooter,
  CardPreview,
  Text,
  makeStyles,
  FluentProvider,
  teamsLightTheme,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  appContainer: {
    width: '50%',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#ffffff'
    },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#0078D4',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#5c5c5c',
  },
  resultCard: {
    marginBottom: '10px',
  },
  searchWrapper: {
    display: 'flex',
    width: '100%',
  },
  inputField: {
    flex: 1, // Ensures the input takes up all available space
    marginRight: '0', // No margin between the input and button
  },
  searchButton: {
    backgroundColor: '#0078D4',
    marginLeft: '5px', // No margin between input and button
  },
});

const SearchApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const styles = useStyles();

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
