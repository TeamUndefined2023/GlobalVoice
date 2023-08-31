import React, { useEffect, useState } from 'react'
import { HashLink } from 'react-router-hash-link';
import '../styles/drawer.css';
import navicon from '../assets/nav_anim.png';
import logo from '../assets/logo.png'
import { useAuth0 } from "@auth0/auth0-react";
function Drawercontent(props){
  const[target,setTarget]=useState(sessionStorage.getItem('target') || 'lobbyBtn');

  const setBtnBg=(id)=>{
    setTarget(id);
  }
  useEffect(()=>{
    sessionStorage.setItem('target',target);
  },[target]);
  return(
    <div className="drawer-content">
        <HashLink to={'/#Lobby'}  className={target==='lobbyBtn'? 'selectedBtn btn':'unselected btn'} id='lobbyBtn' onClick={()=>setBtnBg('lobbyBtn')}><i class="fa-solid fa-right-to-bracket fa-2xl icon" ></i> <img src={navicon} className="sideAnim"alt="" /></HashLink>
        {/* <HashLink to={'/Main'}  className={target==='videoBtn'? 'selectedBtn btn':'unselected btn'} id='videoBtn' onClick={()=>setBtnBg('videoBtn')}><i class="fa-solid fa-video fa-2xl icon" ></i> <img src={img} className="sideAnim"alt="" /></HashLink> */}
        <HashLink to={'/Guide'} className={target==='guideBtn'? 'selectedBtn btn':'unselected btn'} id='guideBtn'  onClick={()=>setBtnBg('guideBtn')}><i class="fa-solid fa-book fa-2xl icon"></i> <img src={navicon} className="sideAnim"alt="" /></HashLink>
        {/* <i class="fa fa-solid fa-house" style={{color: 'white',}}></i> */}
      </div>);
}const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
      <i class="fa-solid fa-circle-xmark fa-2xl icon"  onClick={() => logout({ logoutParams: { returnTo:"http://localhost:3000" } })}></i>

  );
};
function Exit(props){
  return (
    <div className="exit">
    {/* <i class="fa-solid fa-circle-xmark fa-2xl icon"></i> */}
    <LogoutButton/>
    </div>);
}


const Drawer = () => {
  return (
    <>
    <div className="drawer-main">
        <img src={logo} className="logo "alt="logo" />
        <Drawercontent/>
        <Exit/>
    </div>
    </>
  )
}

export default Drawer;
