import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summarizeText = async () => {
    if (!text) {
      setError('Please enter text to summarize.');
      return;
    }
    setLoading(true);
    setError('');
    setSummary('');

    try {
      // Send POST request to your backend
      const response = await axios.post('https://hugging-backend.onrender.com/api/summarize', {
        text,
      });

      // The response data contains the summarized text
      const { data } = response;
      if (data && data.summary) {
        setSummary(data.summary);
      } else {
        setError('Error summarizing the text.');
      }
    } catch (err) {
      console.error(err);
      setError('Error contacting the backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Text Summarization</h1>
      <div>
        <textarea
          rows="10"
          placeholder="Enter text to summarize"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <button onClick={summarizeText} disabled={loading}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading summary...</div>}
      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
