import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Input,
  Button,
  Spinner,
  Card,
  CardHeader,
  CardFooter,
  Text,
  Link,
  SearchBox,
  TeachingPopover,
  TeachingPopoverBody,
  TeachingPopoverHeader,
  TeachingPopoverTitle,
  TeachingPopoverSurface,
  TeachingPopoverTrigger,
  TeachingPopoverFooter,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';
import styles from './assets/styles/SearchPage.module.css'; // Import the CSS module

const SearchPage = () => {
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sampleCount, setSampleCount] = useState(0);
  const [isSampleCountLoading, setIsSampleCountLoading] = useState(true); // For sample count loading
  const location = useLocation();
  const [popOverOpen, setPopOverOpen] = useState(false);

  useEffect(() => {
    const fetchSampleCount = async () => {
      setIsSampleCountLoading(true);
      const response = await fetch('./data-api/rest/countSamples');
      const data = await response.json();
      const count = data.value[0].total_sample_count;
      setSampleCount(count);
      setIsSampleCountLoading(false);
    };
   
    fetchSampleCount();

    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    //console.log('Query:', q);
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [location]);

  //console.log('PopOverOpen:', Cookies.get('popOverOpen'));
  if (!Cookies.get('popOverOpen')) 
  {
    setPopOverOpen(true);
    Cookies.set('popOverOpen', 'true');
  } 
  
  const handleSearch = async (searchQuery) => {
    if ((!query) && (!searchQuery)) return;
    if (!searchQuery) {
      searchQuery = query;
    }
    setLoading(true);
    setError('');
    setResults([]);
    setSearchCompleted(false);
    console.log('searchQuery:', searchQuery);
    try {
      const response = await fetch('./data-api/rest/findSamples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: searchQuery })
      });
      const data = await response.json();
      //console.log(data);      
      setResults(data.value);
    } catch (error) {
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
      setSearchCompleted(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchClick = (event) => {
    handleSearch();
  }

  return (
    <div className={styles.appContainer}>
      <div className={styles.header}>
        <div className={styles.title}>
          Azure SQL DB Samples AI Search 💡🔍
        </div>
        <div className={styles.subtitle}>
          Find samples using AI-powered search capabilities 🚀
        </div>
        <div className={styles.sampleCount}>
          {isSampleCountLoading ? 'Finding how many samples are available...' : `There are ${sampleCount} samples in the database.`}
        </div>
        <div className={styles.teachingPopover}>
          <TeachingPopover defaultOpen={popOverOpen}>
            <TeachingPopoverTrigger>
              <Button>How does it work?</Button>
            </TeachingPopoverTrigger>
            <TeachingPopoverSurface className={styles.popOverSurface}>
              <TeachingPopoverHeader>Tips</TeachingPopoverHeader>
              <TeachingPopoverBody>
                <TeachingPopoverTitle>AI-Powered Search</TeachingPopoverTitle>
                <div>
                  This search engine uses AI to find samples from the Azure SQL Database Samples repository using a RAG pattern with structured output. 
                  <ul>
                    <li>Similiarity search across all available resources is done using the newly introduced vector support in Azure SQL Database.</li>
                    <li>Results are then passed to a GPT-4o model to generate a sample summary and thoughts with a defined structured output.</li>                   
                    <li>Semantic caching is used to improve the performance of the search engine and reduce LLM calls costs.</li>
                  </ul>
                  If you want to have more details and get the source code of this sample, just ask about "this sample".                                     
                </div>
              </TeachingPopoverBody>
              <TeachingPopoverFooter primary="Got it" />
            </TeachingPopoverSurface>
          </TeachingPopover>
        </div>
      </div>
      <div className={styles.searchWrapper}>
        <SearchBox
          placeholder="Type your query in natural language. The AI will do the rest..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          contentBefore={<Search24Regular />}
          appearance="outline"
          className={styles.searchBox}
        />
        <Button
          appearance="primary"
          onClick={handleSearchClick}
          disabled={loading}
          className={styles.searchButton}
        >
          Search
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Spinner label="Searching..." />
        </div>
      )}

      {error && (
        <Text block style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </Text>
      )}

      <div className={styles.results}>
        {results.length === 0 && !loading ? (
          query && searchCompleted == true ? (
            <Text block style={{ textAlign: 'center' }}>
              No results found. Try a different query!
            </Text>
          ) : (
            <Text block style={{ textAlign: 'center' }}>
              Start searching to get results!
            </Text>
          )
        ) : (
          results.map((result, index) => {
            let responseStatus;
            if (result.error) {
              console.log(JSON.parse(result.response));
              responseStatus = JSON.parse(result.response).response.status.http;
              if (responseStatus.code === 429) {
                responseStatus.description = "Too many requests. Please try again later.";
              }
            }
            return (
              <Card key={index} className={styles.resultCard}>
                {result.error ? (
                  <div className={styles.error}>
                    {result.error}<br />
                    {responseStatus.code} - {responseStatus.description}
                  </div>
                ) : (
                  <>
                    <CardHeader
                      header={
                        <div className={styles.resultCardHeader}>
                          {result.name}
                        </div>
                      }
                      description={
                        <div>
                          <div className={styles.resultDescription}>
                            <ReactMarkdown>
                              {result.sample_summary}
                            </ReactMarkdown>
                          </div>
                          <div className={styles.resultThoughts}>
                            {result.thoughts}
                          </div>
                        </div>
                      }
                    />
                    <CardFooter>
                      <Link href={result.url} target="_blank" rel="noopener noreferrer">
                        {result.url}
                      </Link>
                    </CardFooter>
                  </>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchPage;
