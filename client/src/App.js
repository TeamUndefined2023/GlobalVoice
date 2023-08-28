import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Main from "./components/Main";
import Drawer from "./components/Drawer";
import Guide from "./components/Guide";
import './styles/app.css';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import Lobby from './components/Lobby';
import { useState } from "react";

function App() {
  const [name,setname]=useState("_");
  // const {user,isAuthenticated,isLoading}=useAuth0();
  // if(!isAuthenticated){
  //   return <LoginButton/>;
  // }
  // else if(isLoading){
  //   return <div>Loading..</div>;
  // }
  return (
    <Router >
        <Drawer></Drawer>
        <Routes>
          <Route path="/" element={<Lobby setname={setname}/>}/>
          <Route path="/room/:roomId" element={<Main userName={name}/>}/>
          <Route path="/Guide" element={<Guide/>}/>
        </Routes> 
    </Router>
  ); 
}

export default App;