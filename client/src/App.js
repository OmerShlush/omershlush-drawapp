import { BrowserRouter, Route, Routes } from "react-router-dom";

import WelcomePage from "./pages/welcome";
import ChoosePage from "./pages/choose";
import WaitingPage from "./pages/waiting.js";
import GamePage from "./pages/game";

import { io } from "socket.io-client";
import MainLayout from "./components/layout/MainLayout";
import ErrorPage from "./pages/error";

function App() {
  // SETTING SOCKET FOR CONTINUOUSLY WORK IN API
  const socket = io("http://localhost:3001", {
    autoConnect: false,
  });

  return (
    <MainLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<WelcomePage />} />
          <Route path="/waiting" element={<WaitingPage socket={socket} />} />
          <Route path="/choose" element={<ChoosePage socket={socket} />} />
          <Route path="/game" element={<GamePage socket={socket} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </MainLayout>
  );
}

export default App;
