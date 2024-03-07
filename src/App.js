import { useState } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    'who won the latest Novel peace prize?',
    'where is the capital of France',
    'what is the population of Nigeria',
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  }

  const clear = () => {
    setValue('');
    setError('');
    setChatHistory([]);
  }

  const getResponse = async () => {
    if(!value) {
      setError('Please enter a question');
      console.log(error);
      return;
    }
    try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        history: chatHistory,
        message: value
      })
    }

    const response = await fetch('http://localhost:8000/chat', options);
    const data = await response.text();
    console.log(data);
    setChatHistory(oldChatHistory => [...oldChatHistory, {
      role: 'user',
      parts: value
    },
  {
    role: 'model',
    parts: data 
  }
  ]);
  setValue('');
    } catch(error) {
      console.error(error);
      setError('There was an error fetching the data');
    }

  }

  return (    
          <div className='app'>
          <h1>AI Chatbot</h1>
            <p>What do you want to know?
            <button className='surprise' onClick={surprise} disabled={!chatHistory}>Surprise me</button>
            </p>
            <div className='input-container'>
            <input 
            value={value}
            placeholder='Ask me anything'
            onChange={(e) => setValue(e.target.value)}
            />
            {!error && <button onClick={getResponse}>Ask Me</button>}
            {error && <button onClick={clear}>Clear</button>}
            </div>
            {error && <p>{error}</p>}
            <div className="search-result">
              {chatHistory.map((chatItem, index) => <div key={index}>
                <p className='answer'>{chatItem.role} : {chatItem.parts}</p>
              </div>)}
            </div>
          </div>
  );
}

export default App;
