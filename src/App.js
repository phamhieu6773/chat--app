// import logo from './logo.svg';
import "./App.css";
import Login from "./components/Login";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import { AuthProvider } from "./Contex/AuthProvider";
import AppProvider from "./Contex/AppProvider";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteMemberModal from "./components/Modals/InviteMemberModal";
import OptionSelectionModal from "./components/Modals/OptionSelectionModal";
import EiditRoomModal from "./components/Modals/EiditRoomModal";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
        <Routes>
          <Route Component={Login} path="/login" />
          <Route Component={ChatRoom} path="/chat--app" />
        </Routes>
        <AddRoomModal />
        <EiditRoomModal />
        <InviteMemberModal />
        <OptionSelectionModal />
        </AppProvider>  
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
