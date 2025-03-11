import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';

function Main() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const uuid = sessionStorage.getItem("userUuid");

  useEffect(() => {
    if(!token) {
      alert("로그인이 필요합니다.");
      navigate("/login")
      console.log(uuid);
    } 

  }, [navigate]);

  return (
    <div>
      <Nav></Nav>
      <h1>환영합니다!</h1>
      {/* 인증된 사용자만 볼 수 있는 내용 */}
    </div>
  );
}

export default Main;
