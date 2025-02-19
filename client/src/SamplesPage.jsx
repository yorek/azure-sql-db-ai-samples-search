import React, { useState, useEffect } from 'react';
import {
  Button,
  Spinner,
  Link,
  Card,
  CardHeader,
  CardFooter
} from '@fluentui/react-components';
import {Link16Regular, Link20Regular} from '@fluentui/react-icons';
import ReactMarkdown from 'react-markdown';

import PageTitle from './components/PageTitle';

import styles from './assets/styles/SamplesPage.module.css';

const SamplesPage = () => {

  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    console.log('Fetching samples...');
    const fetchSamples = async () => {
      setLoading(true);
      const response = await fetch('./data-api/rest/samples?$orderby=created_on desc');
      const data = await response.json();
      setSamples(data.value);
      setLoading(false);
      console.log('Done.');
    };

    fetchSamples();
  }, [location]);

  return (
    <>
      <PageTitle />
      <div className={styles.samples}>
        {loading && <p>Loading...</p>}
        {!loading &&
          samples.map((result, index) => {
            return (
              <Card key={index} className={styles.resultCard}>
                <CardHeader
                  header={
                    <div className={styles.resultCardHeader}>
                      <Link href={result.url} target='blank'>{result.name} <Link20Regular /></Link>
                    </div>
                  }
                  description={
                    <div>
                      <div className={styles.resultDescription}>
                        <ReactMarkdown>
                          {result.description}
                        </ReactMarkdown>
                      </div>
                      <div className={styles.resultDetails}>
                        Created on: {result.created_on}, Updated on: {result.updated_on}
                      </div>
                    </div>
                  }
                />
              </Card>
            );
          })
        }
      </div>
    </>
  );
};

export default SamplesPage;
