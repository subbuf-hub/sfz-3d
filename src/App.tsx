import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ColorSelector from './components/ColorSelector';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <ColorSelector />
    </div>
  );
};

export default App;