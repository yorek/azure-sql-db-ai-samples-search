import React, { useState, useEffect } from 'react';
//import styles from './assets/styles/AboutPage.module.css';

const SamplesPage = () => {

  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    console.log('Fetching samples...');
    const fetchSamples = async () => {
      setLoading(true);
      const response = await fetch('./data-api/rest/samples?$orderby=id');
      const data = await response.json();
      setSamples(data.value);
      setLoading(false);
    };
     
    fetchSamples();
    }, []);

  return (
    <>
    {loading && <p>Loading...</p>}
    {!loading &&
      <div>
        {samples.map((sample, index) => (
          <div key={index}>
            <h3>{sample.id}: {sample.name}</h3>
            <p>{sample.description}</p>
            <a href={sample.url}>{sample.url}</a>
          </div>
        ))}
      </div>
  }
    </>
  );
};

export default SamplesPage;
