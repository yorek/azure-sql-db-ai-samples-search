import React, { useState, useEffect } from 'react';
import { json, useParams } from 'react-router-dom';
import { Button, Textarea, Text } from '@fluentui/react-components';
import MonacoEditor from 'react-monaco-editor';
import styles from './assets/styles/EditPage.module.css';

const EditPage = () => {
  const { sampleId } = useParams();
  const [jsonInput, setJsonInput] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        //console.log(sampleId);
        const response = await fetch(`/data-api/rest/get-sample?id=${sampleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
        const data = await response.json();
        var sample = data.value[0];
        //console.log(sample);
        sample.details = JSON.parse(sample.details);
        setJsonInput(JSON.stringify(sample, null, 2));
      } catch (err) {
        setError(err.message);
      }
    };

    if (sampleId) {
      if (!jsonInput)
       fetchSessionData();
    }
  }, [sampleId, jsonInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponseMessage('');
    //setJsonInput(MonacoEditor.value);
    console.log(jsonInput);
    try {
      const response = await fetch('/data-api/rest/add-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'payload': jsonInput })
      });

      if (!response.ok) {
        throw new Error('Failed to add session');
      }

      const data = await response.json();
      setResponseMessage('Sample added successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Session</h1>
      <form onSubmit={handleSubmit}>
        <MonacoEditor
          value={jsonInput}
          language='json'
          width="800"
          height="600"
          onChange={(newValue) => setJsonInput(newValue)}
          placeholder="Enter JSON here"          
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

export default EditPage;