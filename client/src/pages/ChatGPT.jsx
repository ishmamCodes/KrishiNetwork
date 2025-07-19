import React, { useState } from 'react';
import axios from 'axios';

const ChatGPT = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/ai/ask', { question });
      setAnswer(res.data.answer);
    } catch (error) {
      setAnswer('Error fetching answer .');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ask AI</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={askQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {answer && (
        <div className="mt-4 p-4 bg-gray-100 rounded border">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ChatGPT;
