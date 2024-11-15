import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Textarea, Text } from '@fluentui/react-components';
import styles from './assets/styles/EditSessionPage.module.css';

const EditSessionPage = () => {
  const { sessionId } = useParams();
  const [jsonInput, setJsonInput] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`./data-api/rest/getSession/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
        const data = await response.json();
        setJsonInput(JSON.stringify(data, null, 2));
      } catch (err) {
        setError(err.message);
      }
    };

    if (sessionId) {
      //fetchSessionData();
    }
  }, [sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponseMessage('');

    try {
      const response = await fetch('./data-api/rest/upsertSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonInput
      });

      if (!response.ok) {
        throw new Error('Failed to add session');
      }

      const data = await response.json();
      setResponseMessage('Session added successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Session</h1>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter JSON here"
          className={styles.textarea}
        />
        <Button appearance="primary" type="submit" className={styles.submitButton}>
          Submit
        </Button>
      </form>
      {responseMessage && <Text block style={{ color: 'green' }}>{responseMessage}</Text>}
      {error && <Text block style={{ color: 'red' }}>{error}</Text>}
    </div>
  );
};

export default EditSessionPage;