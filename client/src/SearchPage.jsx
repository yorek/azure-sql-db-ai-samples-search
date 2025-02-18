import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  Button,
  Spinner,
  Card,
  CardHeader,
  CardFooter,
  Text,
  Link,
  SearchBox,
  Tag,
  TeachingPopover,
  TeachingPopoverBody,
  TeachingPopoverHeader,
  TeachingPopoverTitle,
  TeachingPopoverSurface,
  TeachingPopoverTrigger,
  TeachingPopoverFooter,
} from '@fluentui/react-components';
import { Alert12Filled, AlertOn16Filled, Note16Filled, Search24Regular, Warning12Filled, Warning16Color, Warning20Color } from '@fluentui/react-icons';
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';
import styles from './assets/styles/SearchPage.module.css'; 
import GitHash from './components/GitVersion';

let pageStatus = "first_load";

const SearchPage = () => {
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [sampleCount, setSampleCount] = useState(0);
  const [isSampleCountLoading, setIsSampleCountLoading] = useState(true); // For sample count loading
  const location = useLocation();
  const [popOverOpen, setPopOverOpen] = useState(false);

  useEffect(() => {
    const fetchSampleCount = async () => {
      setIsSampleCountLoading(true);
      try {
        const response = await fetch('./data-api/rest/countSamples');
        if (response.ok) {
          const data = await response.json();
          const count = data.value[0].total_sample_count;
          setSampleCount(count);
        }        
      } catch (error) {
        console.log(error);
      } finally {
        setIsSampleCountLoading(false);
      }
    };

    fetchSampleCount();

    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    //console.log('Query:', q);
    if (q) {
      setQuery(q);
      handleSearch(q);
    } else {
      getLatestSamples();
    }
  }, [location]);

  //console.log('PopOverOpen:', Cookies.get('popOverOpen'));
  if (!Cookies.get('popOverOpen'))
    setPopOverOpen(true);
  Cookies.set('popOverOpen', 'true', { expires: 30 });

  const getLatestSamples = async () => {
    try {
      const response = await fetch('./data-api/rest/latestSamples');
      if (response.ok) {
        const data = await response.json();
        //console.log(data.value);
        setResults(data.value);
      } else {
        //console.log(response);
        setError([{ code: response.status, description: response.statusText }]);
      }
      pageStatus = "latest_samples";
    } catch (error) {
      setError([{ code: error.code, description: error.message }]);
      console.log(error);
    }
  }

  const getError = (result) => {
    let responseStatus = { code: 0, description: '' };

    //console.log("Result", result);

    if (result.error != null) {
      responseStatus = {
        code: result.error.status,
        description: result.error.message
      }
    }

    if (result.value != null && result.value.length > 0 && result.value[0].error_code != null) {
      responseStatus = {
        code: result.value[0].error_code,
        description: result.value[0].error_message
      }
    }

    //console.log("ResponseStatus", responseStatus);
    return responseStatus;
  }

  const handleSearch = async (searchQuery) => {
    if ((!query) && (!searchQuery)) return;
    if (!searchQuery) {
      searchQuery = query;
    }
    setLoading(true);
    setError([]);
    setResults([]);
    setSearchCompleted(false);
    //console.log('searchQuery:', searchQuery);
    try {
      const response = await fetch('./data-api/rest/findSamples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: searchQuery })
      });
      const data = await response.json();
      let errorStatus = getError(data);
      if (errorStatus.code != 0) {
        setError([errorStatus]);
      } else {
        setResults(data.value);
      }
    } catch (error) {
      console.log(error);
      setError([{ code: error.code, description: error.message }]);
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

  const handleSearchClick = () => {
    console.log('Search button clicked');
    handleSearch();
  }

  const handleOpenLink = (event, result) => {
    window.open(result.url, '_blank', 'noopener,noreferrer');
  }

  const handleGoToGithub = () => {
    window.open("https://github.com/yorek/azure-sql-db-ai-samples-search", '_blank', 'noopener,noreferrer');
  }

  if (results != null) {
    if (results.length === 0 && loading == true) pageStatus = "searching";
    if (results.length === 0 && !loading && searchCompleted) pageStatus = "no_results";
    if (results.length > 0 && !loading && searchCompleted) pageStatus = "results_found";
  }
  if (error.length > 0) pageStatus = "error";

  console.log('Page Status:', pageStatus);
  //console.log('Search Completed:', searchCompleted);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          Azure SQL DB Samples AI Agentic RAG Search 💡🔍
        </div>
        <div className={styles.subtitle}>
          Find samples using AI Agents search capabilities 🚀
        </div>
        <div className={styles.sampleCount}>
          {isSampleCountLoading ? 'Finding how many samples are available...' : (<span>There are <Link href="https://aka.ms/sqlai-samples" target="_blank">{sampleCount} samples</Link> in the database.</span>)}
        </div>
        <div className={styles.buttonsArea}>
          <TeachingPopover defaultOpen={popOverOpen}>
            <TeachingPopoverTrigger>
              <Button>How does it work?</Button>
            </TeachingPopoverTrigger>
            <TeachingPopoverSurface className={styles.popOverSurface}>
              <TeachingPopoverHeader>Tips</TeachingPopoverHeader>
              <TeachingPopoverBody>
                <TeachingPopoverTitle>AI Agent Powered Search</TeachingPopoverTitle>
                <div>
                  This search engine uses AI Agents to find samples from the <Link href="https://aka.ms/sqlai-samples" target="_blank">Azure SQL Database Samples repository</Link> using a RAG pattern with structured output.
                  <ul>
                    <li>The searched text is given to an <strong>AI Agent</strong> that decide the best tool to use to answer the question, either using similarity search or generating and executing a SQL query</li>
                    <li>Similiarity search across all available resources is done using the newly introduced <Link href='https://devblogs.microsoft.com/azure-sql/exciting-announcement-public-preview-of-native-vector-support-in-azure-sql-database/' target="_blank">vector support in Azure SQL Database</Link>.</li>
                    <li>Results are then passed to a GPT-4o model to generate a sample summary and thoughts with a defined <Link href='https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/structured-outputs?tabs=rest' target="_blank">structured output</Link>.</li>
                    <li><strong>Semantic caching</strong> is used to improve the performance of the search engine and reduce LLM calls costs.</li>
                  </ul>
                  If you want to have more details and get the source code of this sample, just ask about "this agentic AI sample" or "this website sample". Read more about creating AI apps with Azure SQL here: <Link href="https://aka.ms/sqlai" target="_blank">https://aka.ms/sqlai</Link>
                </div>
              </TeachingPopoverBody>
              <TeachingPopoverFooter primary="Got it" />
            </TeachingPopoverSurface>
          </TeachingPopover>

          <Button onClick={handleGoToGithub} target="_blank">Go to GitHub Repo</Button>
        </div>        
      </div>

      <GitHash />
      
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
      
      <Text block style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Alert12Filled /> <strong>Tip:</strong> Try asking questions like "Samples used in Orlando Live 360 in 2024" or "Show me the latest 5 samples".
        <br />
        <Warning12Filled/> <strong>Warning!</strong> This sample is using free Azure OpenAI SKU so throttling and 500 errors can happen during peak usage.      
      </Text>

      {(pageStatus == "searching") && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Spinner label="Searching..." />
        </div>
      )}

      {(pageStatus == "error") && (
        <Text block style={{ textAlign: 'center', color: 'red', marginBottom: '20px' }}>
          {error[0].code} - {error[0].description}
        </Text>
      )}

      {(pageStatus === "first_load") &&
        (
          <Text block style={{ textAlign: 'center' }}>
            Loading latest samples...
          </Text>
        )
      }

      {(pageStatus === "latest_samples") &&
        (
          <Text block style={{ textAlign: 'center' }}>
            Start searching to get results, or check out the latest samples below.
          </Text>
        )
      }

      {(pageStatus === "no_results") &&
        (
          <Text block style={{ textAlign: 'center' }}>
            No results found. Please try another query.
          </Text>
        )
      }

      {(pageStatus === "results_found" || pageStatus === "latest_samples") &&
        (         
          <div className={pageStatus === "results_found" ? styles.results : styles.latests}>
            {
              results.map((result, index) => {
                return (
                  <Card key={index} className={styles.resultCard}>
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
                    <CardFooter className={styles.resultCardFooter}>
                      <Button onClick={(event) => handleOpenLink(event, result)}>Open Link</Button>
                    </CardFooter>
                  </Card>
                );
              })
            }
          </div>
        )}
    </>
  );
};

export default SearchPage;
