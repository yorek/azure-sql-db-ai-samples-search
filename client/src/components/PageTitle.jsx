import { useState, useEffect } from 'react';
import { Link } from '@fluentui/react-components';
import styles from './PageTitle.module.css';
import fetchRetry from '../utils/fetchRetry';

export default function PageTitle() {
  const [sampleCount, setSampleCount] = useState(0);
  const [isSampleCountLoading, setIsSampleCountLoading] = useState(true);

  useEffect(() => {
    const fetchSampleCount = async () => {
      setIsSampleCountLoading(true);
      try {
        const response = await fetchRetry('./data-api/rest/countSamples');
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
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        Azure SQL DB Samples AI Agentic RAG Search 💡🔍
      </div>
      <div className={styles.subtitle}>
        Find samples using AI Agents search capabilities 🚀
      </div>
      <div className={styles.sampleCount}>
        {isSampleCountLoading ? 'Finding how many samples are available...' : (<span>There are <Link href="/samples">{sampleCount} samples</Link> in the database.</span>)}
      </div>
    </div>
  );
};

