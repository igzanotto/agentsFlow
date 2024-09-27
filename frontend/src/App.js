import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FlowDiagramBoard from './components/FlowDiagramBoard';
import CustomNodeFlow from './components/FlowBoard';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <CustomNodeFlow />
    </div>
  );
}

export default App;
