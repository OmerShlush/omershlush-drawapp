import { BrowserRouter, Route, Routes } from 'react-router-dom';

import WelcomePage from './pages/welcome';
import ChoosePage from './pages/choose';
import WaitingPage from './pages/waiting.js';
import GamePage from './pages/game';

import { io } from 'socket.io-client';
import { useEffect } from 'react';

function App() {
  
  const socket = io('http://localhost:3001', {
    autoConnect: false
  });

  useEffect (() => {
    console.log(socket);
  });
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' exact element={<WelcomePage/>} />
        <Route path='/waiting' element={<WaitingPage socket={socket}/>} />
        <Route path='/choose' element={<ChoosePage socket={socket}/>} />
        <Route path='/game' element={<GamePage socket={socket}/>} />        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
